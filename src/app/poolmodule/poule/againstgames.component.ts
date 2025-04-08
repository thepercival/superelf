import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstGpp, AgainstH2h, AgainstSide, AllInOneGame, Competition, Competitor, CompetitorBase, GamePlace, GameState, NameService, Poule, Single, StartLocation, StartLocationMap, Structure, StructureNameService, Team, TeamCompetitor, TogetherGame } from 'ngx-sport';
import { concatMap, filter, forkJoin, from, Observable, of } from 'rxjs';
import { AuthService } from '../../lib/auth/auth.service';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { DateFormatter } from '../../lib/dateFormatter';
import { S11Formation } from '../../lib/formation';
import { S11FormationPlace } from '../../lib/formation/place';
import { FormationRepository } from '../../lib/formation/repository';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { SuperElfNameService } from '../../lib/nameservice';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { Pool } from '../../lib/pool';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { CompetitionsNavBarItem, NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PouleTitleComponent } from './title.component';
import { GameScrollerComponent } from '../game/source/gameScroller.component';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { TeamNameComponent } from '../team/name.component';
import { PoolCompetitionsNavBarComponent } from '../../shared/poolmodule/competitionsNavBar/competitionsNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { facCup, facSuperCup } from '../../shared/poolmodule/icons';
import { faMessage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { GameRoundGetter } from '../../lib/gameRound/gameRoundGetter';
import { GameRoundRepository } from '../../lib/gameRound/repository';
import { SourceAgainstGamesGetter } from '../../lib/gameRound/sourceAgainstGamesGetter';
import { ActiveViewGameRoundsCalculator } from '../../lib/gameRound/activeViewGameRoundsCalculator';
import { GameRoundMap } from '../../lib/gameRound/gameRoundMap';
import { SportVariant } from 'ngx-sport/src/sport/variant';
import { S11FormationMap } from '../allinonegame/allinonegame.component';
import { FormationGetter } from '../../lib/formation/formationGetter';
import { AgainstGamesTableComponent } from '../game/source/againstGamesTable/againstgames-table.component';
import { PouleTitleWithGameRoundsComponent } from '../game/title-againstgame-pool.component';
import { EscapeHtmlPipe } from '../../shared/commonmodule/escapehtmlpipe';

@Component({
  selector: "app-pool-againstgames",
  standalone: true,
  imports: [
    SuperElfIconComponent,
    FontAwesomeModule,
    PouleTitleWithGameRoundsComponent,
    PoolCompetitionsNavBarComponent,
    AgainstGamesTableComponent,
    PoolNavBarComponent,
    LineIconComponent,
    NgbAlertModule,
    NgTemplateOutlet,
    EscapeHtmlPipe
  ],
  templateUrl: "./againstgames.component.html",
  styleUrls: ["./againstgames.component.scss"],
})
export class PoolPouleAgainstGamesComponent
  extends PoolComponent
  implements OnInit
{
  public currentGameRound: WritableSignal<GameRound | undefined> =
    signal(undefined);
  public viewGameRounds: WritableSignal<GameRound[]> = signal([]);
  public homeItem: WritableSignal<CompetitorPoolUserAndFormation | undefined> =
    signal(undefined);
  public awayItem: WritableSignal<CompetitorPoolUserAndFormation | undefined> =
    signal(undefined);

  public sourceStartLocationMap: StartLocationMap | undefined;

  public leagueName!: LeagueName;

  // private sideMap: SideMap|undefined;
  public poolPoule: Poule | undefined;
  public sourceGameRoundGames: AgainstGame[] = [];

  public gameRoundCacheMap = new Map<number, true>();
  // public homeGameRoundStatistics: StatisticsMap|undefined;
  // public awayGameRoundStatistics: StatisticsMap|undefined;

  public processingGames: WritableSignal<boolean> = signal(true);
  public processingStatistics: WritableSignal<boolean> = signal(true);
  public poolCompetitors: PoolCompetitor[] = [];
  private gameRoundGetter: GameRoundGetter;
  private formationGetter: FormationGetter;
  public statisticsGetter = new StatisticsGetter();
  private sourceAgainstGamesGetter: SourceAgainstGamesGetter;
  private activeGameRoundsCalculator: ActiveViewGameRoundsCalculator;
  public structureNameService = new StructureNameService();

  public sourcePoule!: Poule;
  public nrOfUnreadMessages = 0;

  public faSpinner = faSpinner;
  public faMessage = faMessage;
  public facCup = facCup;
  public facSuperCup = facSuperCup;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private statisticsRepository: StatisticsRepository,
    private poolUserRepository: PoolUserRepository,
    formationRepository: FormationRepository,
    private structureRepository: StructureRepository,
    protected chatMessageRepository: ChatMessageRepository,
    gameRoundRepository: GameRoundRepository,
    gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    public nameService: SuperElfNameService,
    public dateFormatter: DateFormatter,
    private authService: AuthService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.sourceAgainstGamesGetter = new SourceAgainstGamesGetter(
      gameRepository
    );
    this.gameRoundGetter = new GameRoundGetter(gameRoundRepository);
    this.activeGameRoundsCalculator = new ActiveViewGameRoundsCalculator(
      this.gameRoundGetter
    );
    this.formationGetter = new FormationGetter(formationRepository);
    effect(() => {
      const pool = this.pool;
      const currentGameRound = this.currentGameRound();
      const home = this.homeItem();
      const away = this.awayItem();

      if (currentGameRound && pool && home && away) {
        this.selectGameRound(pool, currentGameRound, home, away);
      }
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      // this.statisticsCache.set(AgainstSide.Home, new Map<number,StatisticsMap>());
      // this.statisticsCache.set(AgainstSide.Away, new Map<number,StatisticsMap>());

      // ViewPeriod moet gebaseerd zijn op wedstrijdnummers uit poolPoule

      this.setPool(pool);

      this.route.params.subscribe((params) => {
        this.leagueName = params["leagueName"];

        const poolCompetition = pool.getCompetition(this.leagueName);
        if (poolCompetition === undefined) {
          this.processing.set(false);
          throw Error("competitionSport not found");
        }
        const user = this.authService.getUser();
        const competitionConfig = pool.getCompetitionConfig();

        // -- GETTING STRUCTURE FOR COMPETITION this.leagueName
        this.structureRepository.getObject(poolCompetition).subscribe({
          next: (poolStructure: Structure) => {
            const poolRound = poolStructure.getSingleCategory().getRootRound();
            const firstPoule =
              this.leagueName === LeagueName.SuperCup ||
              this.leagueName === LeagueName.Competition;
            const poolPoule: Poule = firstPoule
              ? poolRound.getFirstPoule()
              : this.structureRepository.getPouleFromPouleId(
                  poolRound,
                  +params.poolPouleId
                );
            this.poolPoule = poolPoule;

            // bepaal nu met determine wat de actieve

            // -- determine gameRoundNumbers
            const sportVariant = poolCompetition.getSingleSport().getVariant();
            const currentGameRoundNr =
              this.getCurrentSourceGameRoundNrFromPoolPoule(
                poolPoule,
                sportVariant
              );

            const poolGameRoundNrs: number[] = this.getGameRoundNumbers(
              poolPoule,
              poolCompetition.getSingleSport().getVariant()
            );
            const startLocations = this.getStartLocationsFromGameRoundNrs(
              poolPoule,
              poolGameRoundNrs
            );

            this.determineActiveViewPeriod(
              competitionConfig,
              currentGameRoundNr
            ).subscribe({
              next: (activeViewPeriod: ViewPeriod | undefined) => {
                if (activeViewPeriod === undefined) {
                  throw new Error(
                    "unable to determine active viewperiod by gameroundnumbers"
                  );
                }

                // -- GETTING POOLUSERS FOR STARTLOCATIONS
                this.poolUserRepository
                  .getObjects(pool, this.leagueName, startLocations)
                  .subscribe((poolUsers: PoolUser[]) => {
                    this.poolUserFromSession = poolUsers.find(
                      (poolUser: PoolUser) => poolUser.getUser() === user
                    );

                    const getPoolGameRounds: Observable<GameRound>[] =
                      poolGameRoundNrs.map(
                        (poolGameRoundNr: number): Observable<GameRound> => {
                          return this.gameRoundGetter.getGameRound(
                            competitionConfig,
                            activeViewPeriod,
                            poolGameRoundNr
                          );
                        }
                      );

                    forkJoin(getPoolGameRounds).subscribe({
                      next: (gameRounds: GameRound[]) => {
                        this.viewGameRounds.set(gameRounds);

                        forkJoin(
                          this.getHomeAwayCompetitorPoolUserAndFormations(
                            activeViewPeriod,
                            poolUsers,
                            poolPoule
                          )
                        ).subscribe({
                          next: (
                            competitorPoolUserAndFormations: CompetitorPoolUserAndFormation[]
                          ) => {
                            const awayCompetitorPoolUserAndFormation = competitorPoolUserAndFormations.pop();
                            const homeCompetitorPoolUserAndFormation = competitorPoolUserAndFormations.pop();
                            if (homeCompetitorPoolUserAndFormation === undefined
                              || awayCompetitorPoolUserAndFormation === undefined) {
                                throw new Error("home or away competitor not found");
                            }
                            this.homeItem.set(homeCompetitorPoolUserAndFormation);
                            this.awayItem.set(awayCompetitorPoolUserAndFormation);                            
                            const formations = [
                              homeCompetitorPoolUserAndFormation.formation,
                              awayCompetitorPoolUserAndFormation.formation
                            ];
                            this.setStatistics(formations, gameRounds);
                          },
                        });

                        const activeGameRound = gameRounds.find(
                          (gameRound) => gameRound.number == currentGameRoundNr
                        );
                        if (activeGameRound == undefined) {
                          throw new Error("active gameRound not found");
                        }
                        this.currentGameRound.set(activeGameRound);
                      },
                      error: (e) => {
                        console.log(e);
                      },
                    });

                    // -- GETTING FORMATIONS
                    // const getFormationRequests: Observable<S11Formation>[] = [];
                    // if (this.homeCompetitor !== undefined) {
                    //   getFormationRequests.push(
                    //     this.formationRepository.getObject(
                    //       this.homeCompetitor.getPoolUser(),
                    //       activeViewPeriod
                    //     )
                    //   );
                    // }
                    // if (this.awayCompetitor !== undefined) {
                    //   getFormationRequests.push(
                    //     this.formationRepository.getObject(
                    //       this.awayCompetitor.getPoolUser(),
                    //       activeViewPeriod
                    //     )
                    //   );
                    // }
                    // forkJoin(getFormationRequests).subscribe({
                    //   next: (formations: S11Formation[]) => {
                    //     const formationMap = new Map();
                    //     formations.forEach((formation: S11Formation) => {
                    //       if (
                    //         this.homeCompetitor !== undefined &&
                    //         this.homeCompetitor.getPoolUser() === formation.getPoolUser()
                    //       ) {
                    //         formationMap.set(
                    //           formation.getPoolUser().getId(),
                    //           formation
                    //         );
                    //       }
                    //       if (
                    //         this.awayCompetitor !== undefined &&
                    //         this.awayCompetitor.getPoolUser() ===
                    //           formation.getPoolUser()
                    //       ) {
                    //         formationMap.set(
                    //           formation.getPoolUser().getId(),
                    //           formation
                    //         );
                    //       }
                    //     });
                    //     this.formationMap.set(formationMap);

                    // source
                    this.getSourceStructure(
                      pool.getSourceCompetition()
                    ).subscribe({
                      next: (structure: Structure) => {
                        const sourcePoule = structure
                          .getSingleCategory()
                          .getRootRound()
                          .getFirstPoule();
                        this.sourcePoule = sourcePoule;

                        const competitors = sourcePoule
                          .getCompetition()
                          .getTeamCompetitors();
                        this.sourceStartLocationMap = new StartLocationMap(
                          competitors
                        );
                        this.processing.set(false);
                      },
                    });
                    //   },
                    //   error: (e) => {
                    //     console.log(e);
                    //   },
                    // });

                    // set previous gameRound async
                    // set next gameRound async

                    if (this.poolUserFromSession) {
                      this.chatMessageRepository
                        .getNrOfUnreadObjects(poolPoule.getId(), pool)
                        .subscribe({
                          next: (nrOfUnreadMessages: number) => {
                            this.nrOfUnreadMessages = nrOfUnreadMessages;
                          },
                        });
                    }
                  });
              },
            });
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
        });
      });
    });
  }

  determineActiveViewPeriod(
    competitionConfig: CompetitionConfig,
    gameRoundNr: number
  ): Observable<ViewPeriod | undefined> {
    // haal de viewPeriod op waarin zich de gameRoundNrs bevinden
    const assembleViewPeriod = competitionConfig
      .getAssemblePeriod()
      .getViewPeriod();
    const transferViewPeriod = competitionConfig
      .getTransferPeriod()
      .getViewPeriod();

    const orderedViewPeriods = [assembleViewPeriod, transferViewPeriod];
    if (
      new Date().getTime() > transferViewPeriod.getStartDateTime().getTime()
    ) {
      orderedViewPeriods.reverse();
    }

    const getGameRoundsMaps = orderedViewPeriods.map(
      (viewPeriod: ViewPeriod) => {
        return this.gameRoundGetter
          .getGameRoundMap(competitionConfig, viewPeriod)
          .pipe(
            concatMap((map: Map<number, GameRound>) => {
              const gameRoundMap = new GameRoundMap(viewPeriod);
              Array.from(map.values()).forEach((gameRound: GameRound) => {
                gameRoundMap.set(gameRound.number, gameRound);
              });
              return of(gameRoundMap);
            })
          );
      }
    );

    return forkJoin(getGameRoundsMaps).pipe(
      concatMap((gameRoundMaps: GameRoundMap[]) => {
        return of(
          gameRoundMaps.find((gameRoundMap: GameRoundMap): boolean => {
            return gameRoundMap.has(gameRoundNr);
          })?.viewPeriod
        );
      })
    );
  }

  // const getActiveGameRoundsMaps = getGameRoundsMaps.pipe(
  //     filter((gameRoundMaps: GameRoundMap[]): boolean => {
  //       return gameRoundNrs.some((gameRoundNr: number): boolean => {
  //         return gameRoundMap.has(gameRoundNr);
  //       })
  //     })
  //   );

  //   .filter((gameRoundMap: Map<number, GameRound>): boolean => {
  //     return gameRoundNrs.some((gameRoundNr: number): boolean => {
  //       return gameRoundMap.has(gameRoundNr);
  //     });

  //   .filter((gameRoundMap: Map<number, GameRound>): boolean => {
  //     return gameRoundNrs.some((gameRoundNr: number): boolean => {
  //       return gameRoundMap.has(gameRoundNr);
  //     });

  // Observable<Map<number, GameRound>>
  // });

  // const filteredViewPeriods = getViewPeriods.
  //   concatMap((viewPeriod: ViewPeriod) => {
  //     return this.gameRoundGetter.getGameRoundMap(
  //       competitionConfig,
  //       viewPeriod
  //     );
  //   })
  // })[0];

  // getViewPeriods
  // .flatMap((viewPeriod) => data.epics) // [{id: 1}, {id: 4}, {id: 3}, ..., {id: N}]
  // .filter((epic) => epic.id === id) // checks {id: 1}, then {id: 2}, etc

  //   })
  // );
  // return filteredViewPeriods[0];
  // }

  determineActiveViewGameRound(
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod
  ): Observable<GameRound> {
    return this.activeGameRoundsCalculator.determineActiveViewGameRound(
      competitionConfig,
      viewPeriod,
      GameRoundViewType.Ranking
    );
  }

  get Cup(): LeagueName {
    return LeagueName.Cup;
  }
  get SuperCup(): LeagueName {
    return LeagueName.SuperCup;
  }
  get WorldCup(): LeagueName {
    return LeagueName.WorldCup;
  }
  get Created(): GameState {
    return GameState.Created;
  }
  get Finished(): GameState {
    return GameState.Finished;
  }
  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  selectGameRound(
    pool: Pool,
    gameRound: GameRound,
    homeItem: CompetitorPoolUserAndFormation,
    awayItem: CompetitorPoolUserAndFormation
  ): void {
    this.processing.set(true);

    this.setSourceGameRoundGames(pool.getCompetitionConfig(), gameRound);

    this.processing.set(false);

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
    //   },
    // });
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
                this.sourceGameRoundGames = games;
              },
              complete: () => {
                this.processingGames.set(false);
              },
            });
        },

        // if (gameRound.hasAgainstGames()) {
        //   this.updateSourceGame(this.getDefaultGame(gameRound.getAgainstGames()));
        //   this.processing.set(false);
        //   this.processingGames.set(false);
        //   return;
        // }
      }
    );
  }

  // get AgainstGame(): NavBarItem {
  //   if( this.leagueName === LeagueName.Cup ) {
  //     return NavBarItem.Competitions
  //   }
  //   else if( this.leagueName === LeagueName.SuperCup ) {
  //     return NavBarItem.Competitions
  //   }
  // }

  get Competitions(): NavBarItem {
    return NavBarItem.Competitions;
  }

  getCompetitionNavBarItem(): CompetitionsNavBarItem {
    if (this.leagueName === LeagueName.Cup) {
      return CompetitionsNavBarItem.CupStructure;
    }
    return CompetitionsNavBarItem.SuperCupGame;
  }

  private getStartLocationsFromGameRoundNrs(
    poule: Poule,
    gameRoundNrs: number[]
  ): StartLocation[] {
    const map = new Map();
    const startLocations: StartLocation[] = [];
    poule.getAgainstGames().forEach((game: AgainstGame) => {
      game.getPlaces().forEach((gamePlace: GamePlace) => {
        const startLocation = gamePlace.getPlace().getStartLocation();
        if (
          startLocation !== undefined &&
          !map.has(startLocation.getStartId())
        ) {
          startLocations.push(startLocation);
          map.set(startLocation.getStartId(), startLocation);
        }
      });
    });
    return startLocations;
  }

  getCurrentSourceGameRoundNrFromPoolPoule(
    poolPoule: Poule,
    sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame
  ): number {
    if (
      sportVariant instanceof AgainstH2h ||
      sportVariant instanceof AgainstGpp
    ) {
      const firstInPogress = poolPoule
        .getAgainstGames()
        .find((game: AgainstGame) => game.getState() === GameState.InProgress);
      if (firstInPogress !== undefined) {
        return firstInPogress.getGameRoundNumber();
      }

      const lastFinished = poolPoule
        .getAgainstGames()
        .slice()
        .reverse()
        .find((game: AgainstGame) => game.getState() === GameState.Finished);
      if (lastFinished !== undefined) {
        return lastFinished.getGameRoundNumber();
      }
      const firstCreated = poolPoule
        .getAgainstGames()
        .find((game: AgainstGame) => game.getState() === GameState.Created);
      if (firstCreated !== undefined) {
        return firstCreated.getGameRoundNumber();
      }
    } else {
      const firstInPogress = poolPoule
        .getTogetherGames()
        .find((game: TogetherGame) => game.getState() === GameState.InProgress);
      if (firstInPogress !== undefined) {
        return firstInPogress.getTogetherPlaces()[0].getGameRoundNumber();
      }

      const lastFinished = poolPoule
        .getTogetherGames()
        .slice()
        .reverse()
        .find((game: TogetherGame) => game.getState() === GameState.Finished);
      if (lastFinished !== undefined) {
        return lastFinished.getTogetherPlaces()[0].getGameRoundNumber();
      }
      const firstCreated = poolPoule
        .getTogetherGames()
        .find((game: TogetherGame) => game.getState() === GameState.Created);
      if (firstCreated !== undefined) {
        return firstCreated.getTogetherPlaces()[0].getGameRoundNumber();
      }
    }

    throw new Error("should be a gameroundnumber");
  }

  getGameRoundNumbers(
    poule: Poule,
    sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame
  ): number[] {
    if (
      sportVariant instanceof AgainstH2h ||
      sportVariant instanceof AgainstGpp
    ) {
      return poule
        .getAgainstGames()
        .map((game: AgainstGame) => game.getGameRoundNumber());
    } else {
      return poule.getTogetherGames().map((game: TogetherGame): number => {
        return game.getTogetherPlaces()[0].getGameRoundNumber();
      });
    }
  }

  getCurrentPoolGame(currentGameRound: GameRound): AgainstGame | undefined {
    return this.poolPoule
      ?.getAgainstGames()
      .find(
        (game: AgainstGame): boolean =>
          game.getGameRoundNumber() === currentGameRound.number
      );
  }

  // getPoolGamePoints(
  //   currentGameRound: GameRound,
  //   competitor: PoolCompetitor
  // ): number {
  //   const poolGame = this.getCurrentPoolGame(currentGameRound);
  //   if (poolGame === undefined) {
  //     return 0;
  //   }
  //   const finalScore = poolGame.getScores()[0];
  //   if (finalScore === undefined) {
  //     return 0;
  //   }
  //   const side = this.hasPoolCompetitor(poolGame, AgainstSide.Home, competitor)
  //     ? AgainstSide.Home
  //     : AgainstSide.Away;

  //   return side === AgainstSide.Home
  //     ? finalScore.getHome()
  //     : finalScore.getAway();
  // }

  getSourceStructure(competition: Competition): Observable<Structure> {
    // if (this.sourceStructure !== undefined) {
    //   return of(this.sourceStructure);
    // }
    return this.structureRepository.getObject(competition);
  }

  // getGameRoundByNumber(pool: Pool, gameRoundNumber: number): GameRound {
  //   const viewPeriods = pool.getCompetitionConfig().getViewPeriods();

  //   let viewPeriod = viewPeriods.shift();
  //   while (viewPeriod !== undefined) {
  //     try {
  //       return viewPeriod.getGameRound(gameRoundNumber);
  //     } catch (any) {}
  //     viewPeriod = viewPeriods.shift();
  //   }
  //   throw new Error(
  //     'gameRound could not be found for number "' + gameRoundNumber + '"'
  //   );
  // }

  setStatistics(formations: S11Formation[], gameRounds: GameRound[]): void {
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
      formations.forEach((formation: S11Formation) => {
        getGameRoundStatistics.push(
          this.statisticsRepository.getGameRoundObjects(
            formation,
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

    // this.processingGameRound.set(true);
    // const editPeriod = this.getMostRecentEndedEditPeriod(pool);
    // if (gameRound === undefined || editPeriod === undefined) {
    //   console.error("gameRound or editPeriod is undefined");
    //   this.processingGameRound.set(false);
    //   return;
    // }
    // this.sourceGameManager
    //   .getAgainstGames(
    //     this.sourcePoule,
    //     editPeriod.getViewPeriod(),
    //     gameRound.number
    //   )
    //   .subscribe({
    //     next: (games: AgainstGame[]) => {
    //       this.sourceGames = games;
    //       // this.sideMap = this.getSideMap(games);
    //       if (this.gameRoundCacheMap.has(gameRound.number)) {
    //         this.currentGameRound = gameRound;
    //         this.processingGameRound.set(false);
    //         return;
    //       }
    //       const homeFormation = this.formationsMap.get(AgainstSide.Home);
    //       const awayFormation = this.formationsMap.get(AgainstSide.Away);
    //       if (homeFormation === undefined || awayFormation === undefined) {
    //         return;
    //       }
    //       let homeProcessing = true;
    //       let awayProcessing = true;
    //       this.statisticsRepository
    //         .getGameRoundObjects(
    //           homeFormation,
    //           gameRound,
    //           this.statisticsGetter
    //         )
    //         .subscribe({
    //           next: () => {
    //             this.currentGameRound = gameRound;
    //             homeProcessing = false;
    //             if (!awayProcessing) {
    //               this.gameRoundCacheMap.set(gameRound.number, true);
    //               this.processingGameRound.set(false);
    //             }
    //           },
    //         });
    //       this.statisticsRepository
    //         .getGameRoundObjects(
    //           awayFormation,
    //           gameRound,
    //           this.statisticsGetter
    //         )
    //         .subscribe({
    //           next: () => {
    //             this.currentGameRound = gameRound;
    //             awayProcessing = false;
    //             if (!homeProcessing) {
    //               this.gameRoundCacheMap.set(gameRound.number, true);
    //               this.processingGameRound.set(false);
    //             }
    //           },
    //         });
    //     },
    //   });
  }

  createFormationMap(
    homeItem: CompetitorPoolUserAndFormation,
    awayItem: CompetitorPoolUserAndFormation
  ): S11FormationMap {
    const map = new Map<number, S11Formation>();
    map.set(+homeItem.poolUser.getId(), homeItem.formation);
    map.set(+awayItem.poolUser.getId(), awayItem.formation);
    return map;
  }

  // hasPoolCompetitor(
  //   game: AgainstGame,
  //   side: AgainstSide,
  //   competitor: PoolCompetitor
  // ): boolean {
  //   return game
  //     .getSidePlaces(side)
  //     .some((gamePlace: AgainstGamePlace): boolean => {
  //       const startLocation = gamePlace.getPlace().getStartLocation();
  //       return startLocation
  //         ? this.poolStartLocationMap.getCompetitor(startLocation) ===
  //             competitor
  //         : false;
  //     });
  // }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  // getFormationPlacesLines(
  //   sourceGame: AgainstGame,
  //   team: Team
  // ): FormationPlacesLine[] {
  //   const homeFormationPlaces = this.getFormationPlaces(
  //     sourceGame,
  //     AgainstSide.Home,
  //     team
  //   );
  //   const awayFormationPlaces = this.getFormationPlaces(
  //     sourceGame,
  //     AgainstSide.Away,
  //     team
  //   );

  //   const minNrOfItems = Math.max(
  //     ...[homeFormationPlaces.length, awayFormationPlaces.length]
  //   );
  //   const lines: FormationPlacesLine[] = [];
  //   for (let i = 0; i < minNrOfItems; i++) {
  //     lines.push({
  //       home: homeFormationPlaces.shift(),
  //       away: awayFormationPlaces.shift(),
  //     });
  //   }
  //   return lines;
  // }

  // getFormationPlaces(
  //   sourceGame: AgainstGame,
  //   side: AgainstSide,
  //   team: Team
  // ): (S11FormationPlace | undefined)[] {
  //   const formation = this.formationsMap.get(side);
  //   if (formation === undefined) {
  //     return [];
  //   }
  //   return formation
  //     .getPlaces()
  //     .filter((formationPlace: S11FormationPlace): boolean => {
  //       const s11Player = formationPlace.getPlayer();
  //       if (s11Player === undefined) {
  //         return false;
  //       }
  //       return (
  //         s11Player.getPlayer(team, sourceGame.getStartDateTime()) !== undefined
  //       );
  //     });
  // }

  protected getTeams(
    sourceGame: AgainstGame,
    sourceStartLocationMap: StartLocationMap
  ): Team[] {
    return sourceGame
      .getSidePlaces()
      .map((sideGamePlace: AgainstGamePlace): Team => {
        const startLocation = sideGamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          throw new Error("unknown team");
        }
        const competitor = <TeamCompetitor>(
          sourceStartLocationMap.getCompetitor(startLocation)
        );
        return competitor.getTeam();
      });
  }

  isToday(date: Date): boolean {
    var today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getCompetitors(
    poolUsers: PoolUser[],
    leagueName: LeagueName
  ): PoolCompetitor[] {
    return Pool.getCompetitors(poolUsers, leagueName);
  }

  getCompetitors2(
    game: AgainstGame,
    side: AgainstSide,
    sourceStartLocationMap: StartLocationMap
  ): (Competitor | undefined)[] {
    return game
      .getSidePlaces(side)
      .map((gamePlace: AgainstGamePlace): Competitor | undefined => {
        if (gamePlace === undefined) {
          return undefined;
        }
        const startLocation = gamePlace.getPlace().getStartLocation();
        return startLocation
          ? sourceStartLocationMap.getCompetitor(startLocation)
          : undefined;
      });
  }

  getTeam(sideCompetitor: Competitor | undefined): Team | undefined {
    const teamCompetitor = this.getTeamCompetitor(sideCompetitor);
    return teamCompetitor?.getTeam() ?? undefined;
  }

  getTeamCompetitor(
    sideCompetitor: Competitor | undefined
  ): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  navigateToChat(pool: Pool, poolPoule: Poule): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      poolPoule.getId(),
    ]);
  }

  navigateToSourceGame(pool: Pool, sourceGame: AgainstGame): void {
    this.router.navigate([
      "/pool/sourcegame",
      pool.getId(),
      sourceGame.getGameRoundNumber(),
      sourceGame.getId(),
    ]);
  }

  getAgainstSide(
    sourceGame: AgainstGame,
    team: Team,
    sourceSartLocationMap: StartLocationMap
  ): AgainstSide {
    const side = [AgainstSide.Home, AgainstSide.Away].find(
      (side: AgainstSide): boolean => {
        return sourceGame
          .getSidePlaces(side)
          .some((sideGamePlace: AgainstGamePlace): boolean => {
            const startLocation = sideGamePlace.getPlace().getStartLocation();
            if (startLocation === undefined) {
              return false;
            }
            const competitor = <TeamCompetitor>(
              sourceSartLocationMap.getCompetitor(startLocation)
            );
            return competitor.getTeam() === team;
          });
      }
    );
    if (side === undefined) {
      throw new Error("no side found for team");
    }
    return side;
  }

  navigateToStructure() {
    if (this.pool === undefined) {
      return;
    }
    this.router.navigate([
      "/pool/" + this.leagueName.toLowerCase(),
      this.pool.getId(),
    ]);
  }

  getHomeAwayCompetitorPoolUserAndFormations(
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
}

export interface CompetitorPoolUserAndFormation {
  competitor: PoolCompetitor,
  poolUser: PoolUser,
  formation: S11Formation
}

interface FormationPlacesLine {
  home: S11FormationPlace | undefined;
  away: S11FormationPlace | undefined;
}
