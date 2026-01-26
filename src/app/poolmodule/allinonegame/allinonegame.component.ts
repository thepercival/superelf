import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstSide, Competition, Competitor, CompetitorBase, GameState, Poule, Structure, TeamCompetitor } from 'ngx-sport';
import { concatMap, forkJoin, Observable, of } from 'rxjs';
import { AuthService } from '../../lib/auth/auth.service';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { S11Formation } from '../../lib/formation';
import { FormationRepository } from '../../lib/formation/repository';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { Pool } from '../../lib/pool';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { faMessage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DateFormatter } from '../../lib/dateFormatter';
import { ActiveViewGameRoundsCalculator } from '../../lib/gameRound/activeViewGameRoundsCalculator';
import { GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { CompetitorWithGameRoundsPoints, GameRoundsPoints } from '../../lib/views/togetherRankingView/competitorWithGameRoundsPoints';
import { PoolUsersTotalsGetter } from '../../lib/pool/user/totalsGetter';
import { PoolTotalsRepository, PoolUsersTotalsMap } from '../../lib/totals/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { SourceAgainstGamesGetter } from '../../lib/gameRound/sourceAgainstGamesGetter';
import { GameRoundGetter } from '../../lib/gameRound/gameRoundGetter';
import { FormationGetter } from '../../lib/formation/formationGetter';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { AgainstGamesTableComponent } from '../game/source/againstGamesTable/againstgames-table.component';
import { CompetitorPoolUserAndFormation } from '../poule/againstgames.component';
import { StatisticsRepository } from '../../lib/statistics/repository';


@Component({
  selector: "app-pool-allinonegame-schedule",
  standalone: true,
  imports: [
    NgbAlertModule,
    FontAwesomeModule,
    GameRoundScrollerComponent,
    PoolNavBarComponent,
    NgbNavModule,
    AgainstGamesTableComponent,
  ],
  templateUrl: "./allinonegame.component.html",
  styleUrls: ["./allinonegame.component.scss"],
})
export class PoolAllInOneGameScheduleComponent
  extends PoolComponent
  implements OnInit
{
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
  public competitorPoolUserAndFormations: WritableSignal<
    CompetitorPoolUserAndFormation[]
  > = signal([]);  
  public showTransfers: WritableSignal<boolean> = signal(false);
  public processingGames: WritableSignal<boolean> = signal(true);
  public processingStatistics: WritableSignal<boolean> = signal(true);

  public poolUsers: PoolUser[] = [];
  public statisticsGetter = new StatisticsGetter();

  public activeGameRoundsCalculator: ActiveViewGameRoundsCalculator;
  public poolUsersTotalsGetter: PoolUsersTotalsGetter;
  public formationGetter: FormationGetter;
  public sourceAgainstGamesGetter: SourceAgainstGamesGetter;
  // public poule: Poule | undefined;
  public leagueName!: LeagueName;

  public sourceStructure: Structure | undefined;
  public sourceGameRoundGames: AgainstGame[] = [];

  public sourceAgainstGamesMap: Map<number, AgainstGame[]> = new Map();

  public poolPouleId: string | number | undefined;
  public nrOfUnreadMessages = 0;
  public active = 1;

  public faMessage = faMessage;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    formationRepository: FormationRepository,
    private poolUserRepository: PoolUserRepository,
    private structureRepository: StructureRepository,
    poolTotalsRepository: PoolTotalsRepository,
    gameRoundRepository: GameRoundRepository,
    gameRepository: GameRepository,
    private statisticsRepository: StatisticsRepository,
    public imageRepository: ImageRepository,
    protected chatMessageRepository: ChatMessageRepository,
    public cssService: CSSService,
    private authService: AuthService,
    private myNavigation: MyNavigation,
    public dateFormatter: DateFormatter
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.activeGameRoundsCalculator = new ActiveViewGameRoundsCalculator(
      new GameRoundGetter(gameRoundRepository)
    );
    this.poolUsersTotalsGetter = new PoolUsersTotalsGetter(
      poolTotalsRepository
    );
    this.sourceAgainstGamesGetter = new SourceAgainstGamesGetter(
      gameRepository
    );
    this.formationGetter = new FormationGetter(formationRepository);
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
            if (pool.getCompetitions().length === 0) {              
              this.setAlert('danger', 'de competities zijn nog niet vrijgegeven');
              this.processing.set(false);
              return;
            }
            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.setAlert('danger', 'competitionSport not found');
              this.processing.set(false);
              return;
            }
            this.determineActiveGameRound(
              competitionConfig,
              currentViewPeriod
            ).subscribe({
              next: (activeGameRound: GameRound) => {
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

  getPoolUsersWithGameRoundsPoints(
    pool: Pool,
    poolUsers: PoolUser[],
    viewPeriod: ViewPeriod,
    gameRounds: GameRound[]
  ): Observable<CompetitorWithGameRoundsPoints[]> {
    const scorePointsMap = pool.getCompetitionConfig().getScorePointsMap();
    // const totals: Observable<PoolUsersTotalsMap[]> = [];

    // get totals
    const totals = [];
    {
      totals.push(
        this.poolUsersTotalsGetter.getViewPeriodTotals(pool, viewPeriod)
      );
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
                    points: poolUserTotalsMap.get(poolUser.getId())?.getPoints(scorePointsMap, undefined) ?? 0,
                  };
                }
              );
            const totalPoints = viewPeriodPoints
              .map((viewPeriodPoints: GameRoundsPoints) => viewPeriodPoints.points)
              .reduce((a, b) => a + b, 0);

            const competitors = Pool.getCompetitors(poolUsers,LeagueName.Competition);
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
              gameRoundsPoints: [],
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
  get Finished(): GameState {
    return GameState.Finished;
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

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup =
      false; /*competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    })*/
    this.leagueName = hasWorldCup
      ? LeagueName.WorldCup
      : LeagueName.Competition;
  }

  get Schedule(): NavBarItem {
    return NavBarItem.Schedule;
  }

  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  getDefaultGame(games: AgainstGame[]): AgainstGame {
    let game = games.find(
      (game: AgainstGame) => game.getState() === GameState.Created
    );
    if (game !== undefined) {
      return game;
    }
    game = games.reverse()[0];
    if (game !== undefined) {
      return game;
    }
    throw new Error("no games could be found");
  }

  // getGameRoundByNumber(gameRoundNumber: number): GameRound {
  //   const gameRound = this.gameRounds.find(
  //     (gameRound: GameRound) => gameRound.getNumber() === gameRoundNumber
  //   );

  //   if (gameRound !== undefined) {
  //     return gameRound;
  //   }
  //   throw new Error(
  //     'gameRound could not be found for number "' + gameRoundNumber + '"'
  //   );
  // }

  selectGameRound(
    pool: Pool,
    poolUsers: PoolUser[],
    gameRound: GameRound
  ): void {
    this.processing.set(true);

    this.formationGetter
      .getFormationMap(pool, poolUsers, gameRound.viewPeriod)
      .subscribe({
        next: (formationMap: S11FormationMap) => {          

          this.setSourceGameRoundGames(pool.getCompetitionConfig(), gameRound);

          this.activeGameRoundsCalculator
            .getActiveViewGameRounds(
              pool.getCompetitionConfig(),
              gameRound.viewPeriod,
              gameRound,
              0,
              1
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
                  next: (poolUsersWithGameRoundsPoints: CompetitorWithGameRoundsPoints[]) => {
                    this.poolUsersWithGameRoundsPoints.set(poolUsersWithGameRoundsPoints);

                    const competitorPoolUserAndFormations = poolUsersWithGameRoundsPoints.map(
                      (poolUserWithGameRoundsPoints: CompetitorWithGameRoundsPoints): CompetitorPoolUserAndFormation => {
                        const competitor = poolUserWithGameRoundsPoints.competitor;
                        const poolUser = competitor.getPoolUser();
                        const formation = formationMap.get(+poolUser.getId());
                        if (formation === undefined) {
                          throw new Error("formation not found");
                        }
                        return {
                          competitor: competitor,
                          poolUser: poolUser,
                          formation: formation,
                        };
                    });
                    this.competitorPoolUserAndFormations.set(competitorPoolUserAndFormations);
                    this.setStatistics(competitorPoolUserAndFormations, activeGameRounds);

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
        },
      });

    
  }

  determineActiveGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound> {
    return this.activeGameRoundsCalculator.determineActiveViewGameRound(
      competitionConfig,
      viewPeriod,
      GameRoundViewType.Games
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

  getSourceStructure(competition: Competition): Observable<Structure> {
    if (this.sourceStructure !== undefined) {
      return of(this.sourceStructure);
    }
    return this.structureRepository.getObject(competition).pipe(
      concatMap((structure: Structure) => {
        this.sourceStructure = structure;
        return of(structure);
      })
    );
  }

  setSourceGameRoundGames(
    competitionConfig: CompetitionConfig,
    gameRound: GameRound
  ): void {
    this.processingGames.set(true);

    this.getSourceStructure(competitionConfig.getSourceCompetition()).subscribe(
      {
        next: (sourceStructure: Structure) => {
          const poule = sourceStructure
            .getSingleCategory()
            .getRootRound()
            .getFirstPoule();

          this.sourceAgainstGamesGetter
            .getGameRoundGames(poule, gameRound)
            .subscribe({
              next: (games: AgainstGame[]) => {
                games.sort((a: AgainstGame,b: AgainstGame)=> {
                  if( a.getState() === GameState.Created && b.getState() === GameState.Created  ) {
                    return b.getStartDateTime().getTime() - b.getStartDateTime().getTime();
                  } else if( a.getState() === GameState.Created && b.getState() !== GameState.Created  ) {
                    return -1;
                  } else 
                    return b.getStartDateTime().getTime() - a.getStartDateTime().getTime();
                  });
                this.sourceGameRoundGames = games;
              },
              complete: () => {
                this.processingGames.set(false);
              },
            });
        },
      }
    );
  }

  setStatistics(competitorPoolUserAndFormations: CompetitorPoolUserAndFormation[], gameRounds: GameRound[]): void {
    this.processingStatistics.set(true);

    // if (this.gameRoundCacheMap.has(gameRound.number)) {
    //   return this.statisticsGetter.getFormationGameRoundPoints(
    //       formation,
    //       gameRound,
    //       undefined
    //     );
    // }

    const getGameRoundStatistics: Observable<void>[] = [];
    gameRounds.forEach((gameRound: GameRound) => {
      competitorPoolUserAndFormations.forEach((competitorPoolUserAndFormation: CompetitorPoolUserAndFormation) => {
        getGameRoundStatistics.push(
          this.statisticsRepository.getGameRoundObjects(
            competitorPoolUserAndFormation.formation,
            gameRound,
            this.statisticsGetter
          )
        );
      });
    });

    forkJoin(getGameRoundStatistics).subscribe({
      next: () => {
        // this.statisticsGetter.getFormationGameRoundPoints(
        //   formation,
        //   gameRound,
        //   undefined
        // );
        // this.gameRoundCacheMap.set(gameRound.number, true);

        this.processingStatistics.set(false);
      },
      error: (e) => {
        this.setAlert("danger", e);
      },
    });
  }

  getCompetitorPoolUserAndFormations(
    activeViewPeriod: ViewPeriod,
    poolUsers: PoolUser[],
    poolPoule: Poule
  ): Observable<CompetitorPoolUserAndFormation>[] {
    const poolCompetitors = Pool.getCompetitors(poolUsers, this.leagueName);

    const homeStartLocation = poolPoule.getPlace(1).getStartLocation();
    const awayStartLocation = poolPoule.getPlace(2).getStartLocation();
    if (homeStartLocation === undefined || awayStartLocation === undefined) {
      throw new Error("startLocation not found");
    }

    const homeCompetitor = poolCompetitors.find(
      (competitor: PoolCompetitor) => {
        return competitor.getStartLocation().equals(homeStartLocation);
      }
    );
    const awayCompetitor = poolCompetitors.find(
      (competitor: PoolCompetitor) => {
        return competitor.getStartLocation().equals(awayStartLocation);
      }
    );

    if (homeCompetitor === undefined || awayCompetitor === undefined) {
      throw new Error("startLocation not found");
    }

    const homePoolUser = homeCompetitor.getPoolUser();
    const awayPoolUser = awayCompetitor.getPoolUser();
    return [
      this.formationGetter.getFormation(activeViewPeriod, homePoolUser).pipe(
        concatMap((formation: S11Formation) => {
          return of({
            competitor: homeCompetitor,
            poolUser: homePoolUser,
            formation: formation,
            side: AgainstSide.Home,
          });
        })
      ),
      this.formationGetter.getFormation(activeViewPeriod, awayPoolUser).pipe(
        concatMap((formation: S11Formation) => {
          return of({
            competitor: awayCompetitor,
            poolUser: awayPoolUser,
            formation: formation,
            side: AgainstSide.Away,
          });
        })
      ),
    ];
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  navigateToSourceGame(pool: Pool, game: AgainstGame): void {
    this.router.navigate([
      "/pool/sourcegame",
      pool.getId(),
      game.getGameRoundNumber(),
      game.getId(),
    ]);
  }

  navigateToChat(pool: Pool, poolPouleId: string | number | undefined): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      poolPouleId,
    ]);
  }

  navigateBack() {
    this.myNavigation.back();
  }
}

export interface S11FormationMap extends Map<number,S11Formation>{};