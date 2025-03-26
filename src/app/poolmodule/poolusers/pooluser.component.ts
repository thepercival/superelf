
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
import { Observable, of } from 'rxjs';
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
import { ActiveGameRoundsCalculator } from '../../lib/gameRound/activeGameRoundsCalculator';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';

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

  public processingFormation: WritableSignal<boolean> = signal(true);
  public processingStatistics: WritableSignal<boolean> = signal(false);

  public poolUser: PoolUser | undefined;
  public formation: S11Formation | undefined;
  public leagueName!: LeagueName;

  public gameRoundCacheMap = new Map<number, true>();
  public statisticsGetter = new StatisticsGetter();
  public nameService = new NameService();

  public activeGameRoundsCalculator: ActiveGameRoundsCalculator;
  public totalPoints: number = 0;
  public totalGameRoundPoints: number = 0;

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
    this.activeGameRoundsCalculator = new ActiveGameRoundsCalculator(
      1,
      0,
      gameRoundRepository
    );
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
                  this.poolUserFromSession = poolUser.getUser() === user ? poolUser : undefined;

                  const competition = pool.getCompetition(this.leagueName);
                  if (competition === undefined) {
                    // this.processing.set(false);
                    throw Error("competitionSport not found");
                  }

                  // this.formationRepository
                  //   .getObjectMap(pool, currentViewPeriod)
                  //   .subscribe({
                  //     next: (formationMap: S11FormationMap) => {
                  //       this.formationMap = formationMap;
                  //     },
                  //   });

                  this.determineActiveGameRound(
                    competitionConfig,
                    currentViewPeriod
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
            }
          )
        }
      })
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

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup =
      false; /*competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    })*/
    this.leagueName = hasWorldCup
      ? LeagueName.WorldCup
      : LeagueName.Competition;
  }


    selectGameRound(
      pool: Pool,
      poolUsers: PoolUser[],
      gameRound: GameRound
    ): void {
      this.processing.set(true);
  
      console.log(
        "selectGameRound",
        gameRound.number,
        gameRound.viewPeriod.getStartDateTime()
      );
  
      // this.setSourceGameRoundGames(pool.getCompetitionConfig(), gameRound);
  
      this.activeGameRoundsCalculator
        .getActiveGameRounds(
          pool.getCompetitionConfig(),
          gameRound.viewPeriod,
          gameRound
        )
        .subscribe({
          next: (activeGameRounds: GameRound[]) => {
            this.viewGameRounds.set(activeGameRounds);
  
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
  
            // set previous gameRound async
            this.activeGameRoundsCalculator
              .getPreviousGameRound(
                pool.getCompetitionConfig(),
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
  
    selectViewPeriod(
      pool: Pool,
      poolUsers: PoolUser[],
      viewPeriod: ViewPeriod
    ): void {
      // this.processing.set(true);
      this.previousGameRound.set(undefined);
      this.nextGameRound.set(undefined);
      this.determineActiveGameRound(
        pool.getCompetitionConfig(),
        viewPeriod
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

  setGameRoundAndGetStatistics(
    formation: S11Formation,
    gameRound: GameRound | undefined
  ): void {
    // @TODO CDK
    //   if (gameRound === undefined) {
    //     return;
    //   }
    //   if (this.gameRoundCacheMap.has(gameRound.getNumber())) {
    //     this.currentGameRound = gameRound;
    //     this.totalGameRoundPoints =
    //       this.statisticsGetter.getFormationGameRoundPoints(
    //         formation,
    //         gameRound,
    //         undefined
    //       );
    //     return;
    //   }
    //   this.processingStatistics.set(true);
    //   this.statisticsRepository
    //     .getGameRoundObjects(formation, gameRound, this.statisticsGetter)
    //     .subscribe({
    //       next: () => {
    //         this.currentGameRound = gameRound;
    //         this.totalGameRoundPoints =
    //           this.statisticsGetter.getFormationGameRoundPoints(
    //             formation,
    //             gameRound,
    //             undefined
    //           );
    //         this.gameRoundCacheMap.set(gameRound.getNumber(), true);
    //         this.processingStatistics.set(false);
    //       },
    //       error: (e) => {
    //         this.setAlert("danger", e);
    //         this.processing.set(false);
    //       },
    //     });
  }

  getPoolUserName(poolUser: PoolUser): string {
    const user = poolUser.getUser();
    return this.authService.getUser()?.getId() === user.getId()
      ? "mijn team"
      : "" + user.getName();
  }

  getFormationName(): string {
    return this.formation?.getName() ?? "kies formatie";
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(pool: Pool, s11Player: S11Player, gameRoundNr: number | undefined): void {
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
