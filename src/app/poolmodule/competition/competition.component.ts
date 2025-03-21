import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { Competition, Poule, Structure, StructureEditor } from 'ngx-sport';
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
import { ActiveGameRoundsCalculator } from '../../lib/gameRound/activeGameRoundsCalculator';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { combineLatest, concatMap, forkJoin, Observable, of } from 'rxjs';
import { PoolUsersTotalsGetter } from '../../lib/pool/user/totalsGetter';
import { EditPeriod } from '../../lib/periods/editPeriod';
import { CompetitorWithGameRoundsPoints, GameRoundsPoints } from '../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';
import { PoolCompetitor } from '../../lib/pool/competitor';


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
  public poolUsersWithGameRoundsPoints: WritableSignal<
    CompetitorWithGameRoundsPoints[]
  > = signal([]);
  public badgeCategory: WritableSignal<BadgeCategory | undefined> =
    signal(undefined);

  public poolUsers: PoolUser[] | undefined = [];

  public pouleId: string | number | undefined;
  public leagueName!: LeagueName;
  public activeGameRoundsCalculator: ActiveGameRoundsCalculator;
  public poolUsersTotalsGetter: PoolUsersTotalsGetter;

  public nrOfUnreadMessages = 0;
  public faMessage = faMessage;
  public faSpinner = faSpinner;
  public facTrophy = facTrophy;

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
    this.activeGameRoundsCalculator = new ActiveGameRoundsCalculator(
      1,
      0,
      gameRoundRepository
    );
    this.poolUsersTotalsGetter = new PoolUsersTotalsGetter(
      poolTotalsRepository
    );
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
                this.selectGameRound(
                  pool,
                  poolUsers,
                  activeGameRound
                );
              },
            });

            if (this.poolUserFromSession) {
              this.structureRepository.getFirstPouleId(competition).subscribe({
                next: (pouleId: string | number) => {
                  if (pouleId) {
                    this.chatMessageRepository
                      .getNrOfUnreadObjects(pouleId, pool)
                      .subscribe({
                        next: (nrOfUnreadMessages: number) => {
                          this.nrOfUnreadMessages = nrOfUnreadMessages;
                        },
                      });
                  }
                  this.pouleId = pouleId;
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
      if(viewPeriod === competitionConfig.getTransferPeriod().getViewPeriod() ){ 
        const assembleViewPeriod = competitionConfig.getAssemblePeriod().getViewPeriod();
        totals.push(
          this.poolUsersTotalsGetter.getViewPeriodTotals(pool, assembleViewPeriod)
        );
      };
    }    

    return forkJoin(totals).pipe(
      concatMap((poolUsersTotalsMaps: PoolUsersTotalsMap[], index: number) => {
        const gameRoundsPoolUserTotals = poolUsersTotalsMaps.filter(
          (poolUsersTotalsMap) => poolUsersTotalsMap.gameRoundNr > 0
        );
        const viewPeriodsPoolUserTotals = poolUsersTotalsMaps.filter(
          (poolUsersTotalsMap) => poolUsersTotalsMap.gameRoundNr === 0
        );
        
        const competitorsWithGameRoundPoints = poolUsers.map((poolUser: PoolUser): CompetitorWithGameRoundsPoints => {
            const viewPeriodPoints: GameRoundsPoints[] = viewPeriodsPoolUserTotals.map(
              (poolUserTotalsMap: PoolUsersTotalsMap): GameRoundsPoints => {
                return {
                  number: poolUserTotalsMap.gameRoundNr,
                  points:
                    poolUserTotalsMap
                      .get(poolUser.getId())
                      ?.getPoints(scorePointsMap, this.badgeCategory()) ??
                    0,
                };
              }
            );
            const totalPoints = viewPeriodPoints.map((viewPeriodPoints: GameRoundsPoints) => viewPeriodPoints.points).reduce((a, b) => a + b, 0);

            const gameRoundsPoints: GameRoundsPoints[] = gameRoundsPoolUserTotals.map(
              (poolUserTotalsMap: PoolUsersTotalsMap): GameRoundsPoints => {  
                return {
                  number: poolUserTotalsMap.gameRoundNr,
                  points:
                    poolUserTotalsMap
                      .get(poolUser.getId())
                      ?.getPoints(scorePointsMap, this.badgeCategory()) ??
                    0,
                };
              }
            );
            const competitors = poolUser.getPool().getCompetitors(LeagueName.Competition);
            const competitor: PoolCompetitor|undefined = competitors.find(
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
          });

        competitorsWithGameRoundPoints.sort((a, b) => {
          return b.viewPeriodsPoints - a.viewPeriodsPoints;
        });
        // set rank
        {
          let rank = 0;
          let currentPoints = -1; 
          let nrWithSamePoints = 0;
          competitorsWithGameRoundPoints.forEach(
            (competitorWithGameRoundsPoints: CompetitorWithGameRoundsPoints) => {
              if (currentPoints == -1) {
                currentPoints = competitorWithGameRoundsPoints.viewPeriodsPoints;
                rank++;
              } else if (competitorWithGameRoundsPoints.viewPeriodsPoints < currentPoints) {
                currentPoints = competitorWithGameRoundsPoints.viewPeriodsPoints;
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
    return this.activeGameRoundsCalculator.determineActiveGameRound(
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

    console.log("selectGameRound");

    this.currentGameRound.set(gameRound);

    this.activeGameRoundsCalculator
      .getActiveGameRounds(
        pool.getCompetitionConfig(),
        gameRound.viewPeriod,
        gameRound
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
              console.log(poolUsersWithGameRoundsPoints);
              this.processing.set(false);
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
    this.processing.set(true);
    this.determineActiveGameRound(pool.getCompetitionConfig(), viewPeriod).subscribe({
      next: (activeGameRound: GameRound) => {
        this.selectGameRound(pool, poolUsers, activeGameRound);
      },
    });
  }

  showTransferPeriodModal(
    competitionConfig: CompetitionConfig,
    transferPeriod: EditPeriod
  ) {}

  initCurrentGameRound(pool: Pool, viewPeriod: ViewPeriod): void {
    // @TODO CDK
    // const competitionConfig: CompetitionConfig = pool.getCompetitionConfig();
    // this.gameRoundService.calculateFinished(competitionConfig, viewPeriod, undefined)
    //   .subscribe({
    //     next: (currentGameRound: GameRound) => {
    //       const gameRounds: (GameRound | undefined)[] = viewPeriod
    //         .getGameRounds()
    //         .slice();
    //       this.gameRounds = gameRounds;
    //       const idx = this.gameRounds.indexOf(currentGameRound);
    //       if (idx >= 0) {
    //         this.gameRounds = this.gameRounds
    //           .splice(idx)
    //           .concat([], this.gameRounds);
    //       }
    //       this.updateGameRound(pool, currentGameRound);
    //     },
    //     error: (e: string) => {
    //       this.setAlert("danger", e);
    //       this.processing.set(false);
    //     },
    //   });
  }

  // public updateViewPeriodFromScroller(
  //   pool: Pool,
  //   viewPeriod: ViewPeriod
  // ): void {
  //   this.processing.set(true);
  //   this.currentViewPeriod = viewPeriod;
  //   // this.initPoolUsersTotals(pool, viewPeriod);
  //   // this.initCurrentGameRound(pool, viewPeriod);
  // }

  // updateGameRoundFromScroller(
  //   pool: Pool,
  //   viewPeriod: ViewPeriod,
  //   gameRound: GameRound | undefined
  // ): void {
  //   //   if (gameRound === undefined) {
  //   //     this.currentGameRound = gameRound;
  //   //     this.currentGameRoundPoolUsersTotalsMap = undefined;
  //   //     return;
  //   //   }
  //   //   this.updateGameRound(pool, viewPeriod, gameRound);
  // }

  updateGameRound(
    pool: Pool,
    viewPeriod: ViewPeriod,
    gameRound: GameRound
  ): void {
    // @TODO CDK
    // this.processing.set(true);
    // this.poolTotalsRepository
    //   .getGameRoundPoolUsersMap(pool, viewPeriod, gameRound)
    //   .subscribe({
    //     next: (gameRoundPoolUsersTotals: PoolUsersTotalsMap) => {
    //       this.currentGameRound = gameRound;
    //       // HIER KIJKEN HOE JE DEZE MOET OPBOUWEN, ALS AL BESTAAT DAN NIET NOG EENS OPHALEN VAN SERVER
    //       this.gameRoundTotalsMap.set(
    //         this.getGameRoundIndex(gameRound),
    //         gameRoundPoolUsersTotals
    //       );
    //       this.currentGameRoundPoolUsersTotalsMap = gameRoundPoolUsersTotals;
    //       this.processing.set(false);
    //     },
    //     error: (e: string) => {
    //       this.setAlert("danger", e);
    //       this.processing.set(false);
    //     },
    //   });
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
