import { Component, effect, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { Competition, StructureEditor } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { CompetitionsNavBarItem, NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { ChooseBadgeCategoryModalComponent } from '../badge/choosecategory-modal.component';
import { GameRoundTotalsMap, PoolTotalsRepository, PoolUsersTotalsMap } from '../../lib/totals/repository';
import { SuperElfNameService } from '../../lib/nameservice';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolCompetitionsNavBarComponent } from '../../shared/poolmodule/competitionsNavBar/competitionsNavBar.component';
import { WorldCupNavBarComponent } from '../../shared/poolmodule/poolNavBar/worldcupNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { SuperElfBadgeIconComponent } from '../../shared/poolmodule/icon/badge.component';
import { TogetherRankingComponent } from './togetherranking.component';
import { NgIf } from '@angular/common';
import { faMessage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { facTrophy } from '../../shared/poolmodule/icons';
import { ActiveViewGameRoundsCalculator } from '../../lib/gameRound/activeViewGameRoundsCalculator';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { concatMap, forkJoin, Observable, of } from 'rxjs';
import { PoolUsersTotalsGetter } from '../../lib/pool/user/totalsGetter';
import { EditPeriod } from '../../lib/periods/editPeriod';
import { CompetitorWithGameRoundsPoints, GameRoundsPoints } from '../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { FormationActionOverviewModalComponent } from '../formation/actionoverview.modal.component';
import { GameRoundGetter } from '../../lib/gameRound/gameRoundGetter';


@Component({
  selector: "app-pool-leagues-competition",
  standalone: true,
  imports: [
    FontAwesomeModule,
    PoolCompetitionsNavBarComponent,
    NgbAlertModule,
    WorldCupNavBarComponent,
    PoolNavBarComponent,
    SuperElfIconComponent,
    GameRoundScrollerComponent,
    SuperElfBadgeIconComponent,
    TogetherRankingComponent,
    NgIf,
  ],
  templateUrl: "./competition.component.html",
  styleUrls: ["./competition.component.scss"],
})
export class PoolCompetitionComponent extends PoolComponent implements OnInit {
  public currentGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public viewGameRounds: WritableSignal<GameRound[]> = signal([]);

  public previousGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public nextGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public poolUsersWithGameRoundsPoints: WritableSignal<
    CompetitorWithGameRoundsPoints[]
  > = signal([]);
  public badgeCategory: WritableSignal<BadgeCategory | undefined> =
    signal(undefined);
  public showTransfers: WritableSignal<boolean> = signal(false);

  public poolUsers: PoolUser[] = [];

  public poolPouleId: string | number | undefined;
  public leagueName!: LeagueName;
  public activeGameRoundsCalculator: ActiveViewGameRoundsCalculator;
  public poolUsersTotalsGetter: PoolUsersTotalsGetter;

  public nrOfUnreadMessages = 0;
  public faMessage = faMessage;
  public faSpinner = faSpinner;
  public facTrophy = facTrophy;

  public number: number = 0;

  public increase() {
    console.log(123);
    this.number++;
  }

  public decrease() {
    console.log(98);
    if (this.number === 0) return;
    this.number--;
  }

  onSwipe(event: any) {
    console.log("Swiped!", event);
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    gameRoundRepository: GameRoundRepository,
    poolTotalsRepository: PoolTotalsRepository,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected chatMessageRepository: ChatMessageRepository,
    protected structureRepository: StructureRepository,
    public nameService: SuperElfNameService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.activeGameRoundsCalculator = new ActiveViewGameRoundsCalculator(
      new GameRoundGetter(gameRoundRepository)
    );
    this.poolUsersTotalsGetter = new PoolUsersTotalsGetter(
      poolTotalsRepository
    );
    effect(() => {
      const pool = this.pool;
      const poolUsers = this.poolUsers;
      const currentGameRound = this.currentGameRound();

      if (currentGameRound && pool && poolUsers) {
        this.selectGameRound(pool, poolUsers, currentGameRound);
      }
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);

        this.setLeagueName(pool.getCompetitions());
        const competitionConfig = pool.getCompetitionConfig();
        const currentViewPeriod = pool.getCurrentViewPeriod();

        const user = this.authService.getUser();

        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            this.poolUserFromSession = poolUsers.find(
              (poolUser: PoolUser) => poolUser.getUser() === user
            );
            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              // this.processing.set(false);
              throw Error("competitionSport not found");
            }

            this.determineActiveGameRound(
              competitionConfig,
              currentViewPeriod
            ).subscribe({
              next: (activeGameRound: GameRound) => {
                console.log("currentGameRound sewt");
                this.currentGameRound.set(activeGameRound);
              },
            });

            if (this.poolUserFromSession) {
              this.structureRepository.getFirstPouleId(competition).subscribe({
                next: (poolPouleId: string | number | undefined) => {
                  if (poolPouleId) {
                    this.chatMessageRepository
                      .getNrOfUnreadObjects(poolPouleId, pool)
                      .subscribe({
                        next: (nrOfUnreadMessages: number) => {
                          this.nrOfUnreadMessages = nrOfUnreadMessages;
                        },
                      });
                  }
                  this.poolPouleId = poolPouleId;
                },
              });
            }
            // this.initCurrentGameRound(pool, currentViewPeriod);
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            // this.processing.set(false);
          },
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  get Competitions(): NavBarItem {
    return NavBarItem.Competitions;
  }
  get PouleRankingTogetherSport(): CompetitionsNavBarItem {
    return CompetitionsNavBarItem.PouleRankingTogetherSport;
  }
  get WorldCupLeagueName(): LeagueName {
    return LeagueName.WorldCup;
  }

  openPoolUserTransfersModal(poolUser: PoolUser) {
    const modalRef = this.modalService.open(
      FormationActionOverviewModalComponent,
      { size: "xl" }
    );
    modalRef.componentInstance.poolUser = poolUser;
    modalRef.result.then(
      () => {},
      (reason) => {}
    );
  }

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup =
      false; /*competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    })*/
    this.leagueName = hasWorldCup
      ? LeagueName.WorldCup
      : LeagueName.Competition;
  }

  getPoolUsersWithGameRoundsPoints(
    pool: Pool,
    poolUsers: PoolUser[],
    viewPeriod: ViewPeriod,
    gameRounds: GameRound[]
  ): Observable<CompetitorWithGameRoundsPoints[]> {
    const scorePointsMap = pool.getCompetitionConfig().getScorePointsMap();
    // const totals: Observable<PoolUsersTotalsMap[]> = [];

    // get gameround totals
    const totals = gameRounds.map((gameRound: GameRound) => {
      return this.poolUsersTotalsGetter.getGameRoundTotals(pool, gameRound);
    });
    totals.push(
      this.poolUsersTotalsGetter.getViewPeriodTotals(pool, viewPeriod)
    );

    // get viewPeriod totals
    {
      const competitionConfig = pool.getCompetitionConfig();
      if (
        viewPeriod === competitionConfig.getTransferPeriod().getViewPeriod()
      ) {
        const assembleViewPeriod = competitionConfig
          .getAssemblePeriod()
          .getViewPeriod();
        totals.push(
          this.poolUsersTotalsGetter.getViewPeriodTotals(
            pool,
            assembleViewPeriod
          )
        );
      }
    }

    return forkJoin(totals).pipe(
      concatMap((poolUsersTotalsMaps: PoolUsersTotalsMap[], index: number) => {
        const gameRoundsPoolUserTotals = poolUsersTotalsMaps.filter(
          (poolUsersTotalsMap) => poolUsersTotalsMap.gameRoundNr > 0
        );
        const viewPeriodsPoolUserTotals = poolUsersTotalsMaps.filter(
          (poolUsersTotalsMap) => poolUsersTotalsMap.gameRoundNr === 0
        );

        const competitorsWithGameRoundPoints = poolUsers.map(
          (poolUser: PoolUser): CompetitorWithGameRoundsPoints => {
            const viewPeriodPoints: GameRoundsPoints[] =
              viewPeriodsPoolUserTotals.map(
                (poolUserTotalsMap: PoolUsersTotalsMap): GameRoundsPoints => {
                  return {
                    number: poolUserTotalsMap.gameRoundNr,
                    points:
                      poolUserTotalsMap
                        .get(poolUser.getId())
                        ?.getPoints(scorePointsMap, this.badgeCategory()) ?? 0,
                  };
                }
              );
            const totalPoints = viewPeriodPoints
              .map(
                (viewPeriodPoints: GameRoundsPoints) => viewPeriodPoints.points
              )
              .reduce((a, b) => a + b, 0);

            const gameRoundsPoints: GameRoundsPoints[] =
              gameRoundsPoolUserTotals.map(
                (poolUserTotalsMap: PoolUsersTotalsMap): GameRoundsPoints => {
                  return {
                    number: poolUserTotalsMap.gameRoundNr,
                    points:
                      poolUserTotalsMap
                        .get(poolUser.getId())
                        ?.getPoints(scorePointsMap, this.badgeCategory()) ?? 0,
                  };
                }
              );
            const competitors = Pool.getCompetitors(poolUsers, LeagueName.Competition);
            const competitor: PoolCompetitor | undefined = competitors.find(
              (competitor) => competitor.getPoolUser() === poolUser
            );
            if (competitor == undefined) {
              throw new Error("competitor not found");
            }
            return {
              rank: 0,
              competitor: competitor,
              viewPeriodsPoints: totalPoints,
              gameRoundsPoints: gameRoundsPoints,
            };
          }
        );

        competitorsWithGameRoundPoints.sort((a, b) => {
          return b.viewPeriodsPoints - a.viewPeriodsPoints;
        });
        // set rank
        {
          let rank = 0;
          let currentPoints = -1;
          let nrWithSamePoints = 0;
          competitorsWithGameRoundPoints.forEach(
            (
              competitorWithGameRoundsPoints: CompetitorWithGameRoundsPoints
            ) => {
              if (currentPoints == -1) {
                currentPoints =
                  competitorWithGameRoundsPoints.viewPeriodsPoints;
                rank++;
              } else if (
                competitorWithGameRoundsPoints.viewPeriodsPoints < currentPoints
              ) {
                currentPoints =
                  competitorWithGameRoundsPoints.viewPeriodsPoints;
                rank += 1 + nrWithSamePoints;
                nrWithSamePoints = 0;
              } else {
                nrWithSamePoints++;
              }
              competitorWithGameRoundsPoints.rank = rank;
            }
          );
        }
        return of(competitorsWithGameRoundPoints);
      })
    );
  }

  selectPreviousGameRound(
    competitionConfig: CompetitionConfig,
    currentGameRound: GameRound
  ): void {
    this.activeGameRoundsCalculator
      .getPreviousGameRound(
        competitionConfig,
        currentGameRound.viewPeriod,
        currentGameRound
      )
      .subscribe({
        next: (nextGameRound: GameRound | undefined) => {
          if (nextGameRound) {
            this.currentGameRound.set(nextGameRound);
          }
        },
      });
  }

  selectNextGameRound(
    competitionConfig: CompetitionConfig,
    currentGameRound: GameRound
  ): void {
    this.activeGameRoundsCalculator
      .getNextGameRound(
        competitionConfig,
        currentGameRound.viewPeriod,
        currentGameRound
      )
      .subscribe({
        next: (nextGameRound: GameRound | undefined) => {
          if (nextGameRound) {
            this.currentGameRound.set(nextGameRound);
          }
        },
      });
  }

  // ON CHANGE CURRENT GAMEROUND
  // this.currentGameRoundPoolUsersTotalsMap = this.poolUsersTotalsGetter.getPoolUserTotals(, gameRound);

  // initPoolUsersTotals(pool: Pool, viewPeriod: ViewPeriod): void {
  //   const assembleViewPeriod = pool.getAssembleViewPeriod();

  //   this.poolTotalsRepository
  //     .getViewPeriodPoolUsersMap(pool, assembleViewPeriod)
  //     .subscribe({
  //       next: (assemblePoolUsersTotalsMap: PoolUsersTotalsMap) => {
  //         this.poolUsersTotalsMap = assemblePoolUsersTotalsMap;
  //         if (assembleViewPeriod !== viewPeriod) {
  //           this.poolTotalsRepository
  //             .getViewPeriodPoolUsersMap(pool, viewPeriod)
  //             .subscribe({
  //               next: (poolUsersTotalsMap: PoolUsersTotalsMap) => {
  //                 // console.log(poolUsersTotalsMap);
  //                 assemblePoolUsersTotalsMap.add(poolUsersTotalsMap);
  //               },
  //               error: (e: string) => {
  //                 this.setAlert("danger", e);
  //               },
  //             });
  //         }
  //       },
  //       error: (e: string) => {
  //         this.setAlert("danger", e);
  //       },
  //     });
  // }

  determineActiveGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound> {
    return this.activeGameRoundsCalculator.determineActiveViewGameRound(
      competitionConfig,
      viewPeriod,
      GameRoundViewType.Ranking
    );
  }

  selectGameRound(
    pool: Pool,
    poolUsers: PoolUser[],
    gameRound: GameRound
  ): void {
    this.processing.set(true);

    this.activeGameRoundsCalculator
      .getActiveViewGameRounds(
        pool.getCompetitionConfig(),
        gameRound.viewPeriod,
        gameRound,
        1,
        0
      )
      .subscribe({
        next: (activeGameRounds: GameRound[]) => {
          this.viewGameRounds.set(activeGameRounds);

          this.getPoolUsersWithGameRoundsPoints(
            pool,
            poolUsers,
            gameRound.viewPeriod,
            activeGameRounds
          ).subscribe({
            next: (
              poolUsersWithGameRoundsPoints: CompetitorWithGameRoundsPoints[]
            ) => {
              this.poolUsersWithGameRoundsPoints.set(
                poolUsersWithGameRoundsPoints
              );
              this.processing.set(false);
            },
          });

          // set previous gameRound async
          this.activeGameRoundsCalculator
            .getPreviousGameRound(
              pool.getCompetitionConfig(),
              gameRound.viewPeriod,
              activeGameRounds[0]
            )
            .subscribe({
              next: (gameRound: GameRound | undefined) => {
                console.log();
                this.previousGameRound.set(gameRound);
              },
            });

          // set next gameRound async
          this.activeGameRoundsCalculator
            .getNextGameRound(
              pool.getCompetitionConfig(),
              gameRound.viewPeriod,
              activeGameRounds[activeGameRounds.length - 1]
            )
            .subscribe({
              next: (gameRound: GameRound | undefined) => {
                this.nextGameRound.set(gameRound);
              },
            });
        },
      });
  }

  selectViewPeriod(
    pool: Pool,
    poolUsers: PoolUser[],
    viewPeriod: ViewPeriod
  ): void {
    // this.processing.set(true);
    this.previousGameRound.set(undefined);
    this.nextGameRound.set(undefined);
    console.log("reset prev next");
    this.determineActiveGameRound(
      pool.getCompetitionConfig(),
      viewPeriod
    ).subscribe({
      next: (activeGameRound: GameRound) => {
        this.currentGameRound.set(activeGameRound);
      },
    });
  }

  navigateToChat(pool: Pool, pouleId: string | number): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      pouleId,
    ]);
  }

  openChooseBadgeCategoryModal(): void {
    const modalRef = this.modalService.open(ChooseBadgeCategoryModalComponent);
    modalRef.componentInstance.currentBadgeCategory = this.badgeCategory;
    modalRef.result.then(
      (choosenBadgeCategory: BadgeCategory | undefined) => {
        this.badgeCategory.set(choosenBadgeCategory);
      },
      (reason) => {}
    );
  }
}
