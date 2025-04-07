
import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, FootballLine, Competition } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbAlertModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { S11FormationPlace } from '../../lib/formation/place';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { AuthService } from '../../lib/auth/auth.service';
import { GameRound } from '../../lib/gameRound';
import { concatMap, forkJoin, Observable, of } from 'rxjs';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { S11Formation } from '../../lib/formation';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { FormationLineViewComponent } from '../formation/line/view.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgIf } from '@angular/common';
import { faRightLeft, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LeagueName } from '../../lib/leagueName';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { FormationActionOverviewModalComponent } from '../formation/actionoverview.modal.component';
import { ActiveViewGameRoundsCalculator } from '../../lib/gameRound/activeViewGameRoundsCalculator';
import { GameRoundGetter } from '../../lib/gameRound/gameRoundGetter';

@Component({
  selector: "app-pool-user",
  standalone: true,
  imports: [
    NgbAlertModule,
    FontAwesomeModule,
    GameRoundScrollerComponent,
    FormationLineViewComponent,
    PoolNavBarComponent,
  ],
  templateUrl: "./pooluser.component.html",
  styleUrls: ["./pooluser.component.scss"],
})
export class PoolUserComponent extends PoolComponent implements OnInit {
  public currentGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public viewGameRounds: WritableSignal<GameRound[]> = signal([]);

  public previousGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public nextGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);

  public formation: WritableSignal<S11Formation | undefined> =
    signal(undefined);

  public processingStatistics: WritableSignal<boolean> = signal(false);

  public poolUser: PoolUser | undefined;
  public leagueName!: LeagueName;

  public gameRoundGetter: GameRoundGetter;
  public statisticsGetter = new StatisticsGetter();  
  public nameService = new NameService();

  public activeGameRoundsCalculator: ActiveViewGameRoundsCalculator;
  // public totalGameRoundPoints: number = 0;

  public poolPouleId: string | number | undefined;
  public nrOfUnreadMessages = 0;

  public faRightLeft = faRightLeft;
  public faUsers = faUsers;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected statisticsRepository: StatisticsRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    private structureRepository: StructureRepository,
    protected chatMessageRepository: ChatMessageRepository,
    gameRoundRepository: GameRoundRepository,
    fb: UntypedFormBuilder,
    protected authService: AuthService,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.gameRoundGetter = new GameRoundGetter(gameRoundRepository);
    this.activeGameRoundsCalculator = new ActiveViewGameRoundsCalculator(
      this.gameRoundGetter
    );
    effect(() => {
      const poolUser = this.poolUser;
      const currentGameRound = this.currentGameRound();
      if (currentGameRound && poolUser) {
        this.selectGameRound(poolUser, currentGameRound);
      }
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);

        const competitionConfig = pool.getCompetitionConfig();
        const currentViewPeriod = pool.getCurrentViewPeriod();
        this.setLeagueName(pool.getCompetitions());
        const user = this.authService.getUser();

        this.route.params.subscribe((params) => {
          this.poolUserRepository
            .getObject(pool, +params.poolUserId)
            .subscribe({
              next: (poolUser: PoolUser) => {
                this.poolUser = poolUser;
                this.poolUserFromSession =
                  poolUser.getUser() === user ? poolUser : undefined;

                const competition = pool.getCompetition(this.leagueName);
                if (competition === undefined) {
                  // this.processing.set(false);
                  throw Error("competitionSport not found");
                }

                this.determineActiveGameRound(
                  competitionConfig,
                  currentViewPeriod,
                  +params.gameRoundNr
                ).subscribe({
                  next: (activeGameRound: GameRound) => {
                    this.currentGameRound.set(activeGameRound);
                  },
                });

                if (this.poolUserFromSession) {
                  this.structureRepository
                    .getFirstPouleId(competition)
                    .subscribe({
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
        });
      },
    });
  }

  // ngOnInit() {
  //   super.parentNgOnInit().subscribe({
  //     next: (pool: Pool) => {
  //       this.setPool(pool);

  //       const currentViewPeriod = pool.getCurrentViewPeriod();

  //       this.route.params.subscribe((params) => {
  //         this.poolUserRepository
  //           .getObject(pool, +params.poolUserId)
  //           .subscribe({
  //             next: (poolUser: PoolUser) => {
  //               this.poolUser = poolUser;
  //               const editPeriod = this.getMostRecentEndedEditPeriod(pool);
  //               if (editPeriod !== undefined) {
  //                 this.updateViewPeriod(
  //                   poolUser,
  //                   editPeriod.getViewPeriod(),
  //                   +params.gameRound
  //                 );
  //               }
  //             },
  //             error: (e: string) => {
  //               this.setAlert("danger", e);
  //               this.processing.set(false);
  //             },
  //             complete: () => this.processing.set(false),
  //           });
  //       });
  //     },
  //     error: (e) => {
  //       this.setAlert("danger", e);
  //       this.processing.set(false);
  //     },
  //   });
  // }

  get GoalKeeper(): FootballLine {
    return FootballLine.GoalKeeper;
  }

  openPoolUserTransfersModal() {
    const poolUser: PoolUser | undefined = this.poolUser;
    if (poolUser === undefined) {
      return;
    }
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

  selectGameRound(poolUser: PoolUser, gameRound: GameRound): void {
    this.processing.set(true);

    const competitionConfig = poolUser.getPool().getCompetitionConfig();

    const formationObservable = this.getFormationAsObservable(
      poolUser,
      gameRound.viewPeriod
    );

    // this.setSourceGameRoundGames(pool.getCompetitionConfig(), gameRound);

    this.activeGameRoundsCalculator
      .getActiveViewGameRounds(
        competitionConfig,
        gameRound.viewPeriod,
        gameRound,
        1,
        0
      )
      .subscribe({
        next: (activeGameRounds: GameRound[]) => {
          this.viewGameRounds.set(activeGameRounds);

          this.processingStatistics.set(true);
          formationObservable.subscribe({
            next: (formation: S11Formation) => {
              this.setGameRoundsAndGetStatistics(formation, activeGameRounds);
            },
          });

          // this.getPoolUsersWithGameRoundsPoints(
          //   pool,
          //   poolUsers,
          //   gameRound.viewPeriod,
          //   activeGameRounds
          // ).subscribe({
          //   next: (
          //     poolUsersWithGameRoundsPoints: CompetitorWithGameRoundsPoints[]
          //   ) => {
          //     this.poolUsersWithGameRoundsPoints.set(
          //       poolUsersWithGameRoundsPoints
          //     );
          //     this.processing.set(false);
          //   },
          // });
          this.processing.set(false);

          // set previous gameRound async
          this.activeGameRoundsCalculator
            .getPreviousGameRound(
              competitionConfig,
              gameRound.viewPeriod,
              activeGameRounds[0]
            )
            .subscribe({
              next: (gameRound: GameRound | undefined) => {
                this.previousGameRound.set(gameRound);
              },
            });

          // set next gameRound async
          this.activeGameRoundsCalculator
            .getNextGameRound(
              competitionConfig,
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

  getFormationAsObservable(
    poolUser: PoolUser,
    viewPeriod: ViewPeriod
  ): Observable<S11Formation> {
    const formation = this.formation();
    if (formation != undefined) {
      return of(formation);
    }
    return this.formationRepository.getObject(poolUser, viewPeriod).pipe(
      concatMap((formation: S11Formation) => {
        this.formation.set(formation);
        return of(formation);
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

  determineActiveGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRoundNr: number
  ): Observable<GameRound> {
    if( gameRoundNr > 0 ) {
      return this.gameRoundGetter.getGameRound(
        competitionConfig, viewPeriod,
        gameRoundNr
      );
    }
    return this.activeGameRoundsCalculator.determineActiveViewGameRound(
      competitionConfig,
      viewPeriod,
      GameRoundViewType.Ranking
    );
  }

  selectViewPeriod(pool: Pool, viewPeriod: ViewPeriod): void {
    // this.processing.set(true);
    this.formation.set(undefined);
    this.previousGameRound.set(undefined);
    this.nextGameRound.set(undefined);
    this.determineActiveGameRound(
      pool.getCompetitionConfig(),
      viewPeriod,
      0
    ).subscribe({
      next: (activeGameRound: GameRound) => {
        this.currentGameRound.set(activeGameRound);
      },
    });
  }

  // public updateViewPeriod(
  //   poolUser: PoolUser,
  //   viewPeriod: ViewPeriod,
  //   gameRoundNr: number | undefined
  // ): void {

  //   this.processingFormation.set(true);
  //   this.formationRepository.getObject(poolUser, viewPeriod).subscribe({
  //     next: (formation: S11Formation) => {
  //       this.formation = formation;
  //       this.totalPoints = this.formation.getTotalPoints(undefined);

  //       // @TODO CDK
  //       // this.initGameRounds(poolUser.getPool(), this.formation, gameRoundNr);
  //       this.processingFormation.set(false);
  //     },
  //     error: (e) => {
  //       this.setAlert("danger", e);
  //       this.processing.set(false);
  //     },
  //   });
  // }

  // TODO @CDK
  // private getCurrentGameRound(
  //   pool: Pool,
  //   gameRoundParam: number | undefined
  // ): Observable<GameRound | undefined | CurrentGameRoundNumbers> {
  //   if (gameRoundParam !== undefined && gameRoundParam > 0) {
  //     return of(this.viewPeriod.getGameRound(gameRoundParam));
  //   }
  //   return this.gameRoundRepository.getCurrentNumbers(
  //     pool.getCompetitionConfig(),
  //     this.viewPeriod
  //   );
  // }

  // @TODO CDK
  // private initGameRounds(
  //   pool: Pool,
  //   formation: S11Formation,
  //   gameRoundParam: number | undefined
  // ): void {
  //   this.getCurrentGameRound(pool, gameRoundParam).subscribe({
  //     next: (object: GameRound | undefined | CurrentGameRoundNumbers) => {
  //       let currentGameRound;
  //       if (object instanceof GameRound) {
  //         currentGameRound = object;
  //       } else if (object !== undefined) {
  //         if (object.hasOwnProperty("lastFinishedOrInProgresss")) {
  //           const lastFinishedOrInProgresss = object.lastFinishedOrInProgresss;
  //           if (typeof lastFinishedOrInProgresss === "number") {
  //             currentGameRound = this.viewPeriod.getGameRound(
  //               lastFinishedOrInProgresss
  //             );
  //           }
  //         } else if (object.hasOwnProperty("firstCreatedOrInProgress")) {
  //           const firstCreatedOrInProgress = object.firstCreatedOrInProgress;
  //           if (typeof firstCreatedOrInProgress === "number") {
  //             currentGameRound = this.viewPeriod.getGameRound(
  //               firstCreatedOrInProgress
  //             );
  //           }
  //         }
  //       }
  //       // console.log(object);
  //       const gameRounds: (GameRound | undefined)[] = this.viewPeriod
  //         .getGameRounds()
  //         .slice();
  //       this.gameRounds = gameRounds;
  //       if (currentGameRound !== undefined) {
  //         const idx = this.gameRounds.indexOf(this.currentGameRound);
  //         if (idx >= 0) {
  //           this.gameRounds = this.gameRounds
  //             .splice(idx)
  //             .concat([], this.gameRounds);
  //         }
  //         this.setGameRoundAndGetStatistics(formation, currentGameRound);
  //       }
  //     },
  //     error: (e: string) => {
  //       this.setAlert("danger", e);
  //       this.processing.set(false);
  //     },
  //     complete: () => this.processing.set(false),
  //   });
  // }

  // getGameRounds(): (GameRound | undefined)[] {
  //   const gameRounds = this.poolUser?.getPool().getAssembleViewPeriod().getGameRounds();
  //   return gameRounds !== undefined ? gameRounds : [];
  // }

  setGameRoundsAndGetStatistics(
    formation: S11Formation,
    gameRounds: GameRound[]
  ): void 
  {    
    const getGameRoundStats = gameRounds.map(gameRound => this.statisticsRepository.getGameRoundObjects(formation, gameRound, this.statisticsGetter));
    forkJoin(getGameRoundStats).subscribe({
      next: () => {
        this.processingStatistics.set(false);
      },
      error: (e) => {
        this.setAlert("danger", e);            
      },        
    });
  }

  getHeaderForPoolUser(poolUser: PoolUser): string {
    const user = poolUser.getUser();
    return this.authService.getUser()?.getId() === user.getId()
      ? "mijn team"
      : "" + user.getName();
  }

  // getFormationName(): string {
  //   return this.formation?.getName() ?? "kies formatie";
  // }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(
    pool: Pool,
    s11Player: S11Player,
    gameRoundNr: number | undefined
  ): void {
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), gameRoundNr ?? 0] /*, {
      state: { s11Player, "pool": pool, currentGameRound: undefined }
    }*/
    );
  }

  inAfterTransfer(pool: Pool): boolean {
    return (
      pool.getTransferPeriod().getEndDateTime().getTime() < new Date().getTime()
    );
  }
}
