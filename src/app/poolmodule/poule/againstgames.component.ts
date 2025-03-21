import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstGpp, AgainstH2h, AgainstSide, AllInOneGame, Competition, Competitor, CompetitorBase, GamePlace, GameState, Poule, Round, Single, StartLocation, StartLocationMap, Structure, Team, TeamCompetitor, TogetherGame } from 'ngx-sport';
import { forkJoin, Observable } from 'rxjs';
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
import { SourceGameManager } from '../../lib/gameRound/sourceGameManager';

@Component({
  selector: "app-pool-againstgames",
  standalone: true,
  imports: [
    SuperElfIconComponent,
    FontAwesomeModule,
    PouleTitleComponent,
    GameRoundScrollerComponent,
    TeamNameComponent,
    PoolCompetitionsNavBarComponent,
    PoolNavBarComponent,
    LineIconComponent,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: "./againstgames.component.html",
  styleUrls: ["./againstgames.component.scss"],
})
export class PoolPouleAgainstGamesComponent
  extends PoolComponent
  implements OnInit
{
  public gameRounds: GameRound[] = [];
  public currentGameRound: GameRound | undefined;
  public currentViewPeriod: ViewPeriod | undefined;

  public homeCompetitor: PoolCompetitor | undefined;
  public awayCompetitor: PoolCompetitor | undefined;

  public leagueName!: LeagueName;
  public sourceGames: AgainstGame[] = [];
  // private sideMap: SideMap|undefined;
  public poolPoule: Poule | undefined;
  public poolStartLocationMap!: StartLocationMap;
  private startLocationMap!: StartLocationMap;
  private formationsMap = new Map<AgainstSide, S11Formation>();
  public gameRoundCacheMap = new Map<number, true>();
  // public homeGameRoundStatistics: StatisticsMap|undefined;
  // public awayGameRoundStatistics: StatisticsMap|undefined;

  public processingGameRound: WritableSignal<boolean> = signal(true);
  public poolCompetitors: PoolCompetitor[] = [];
  public statisticsGetter = new StatisticsGetter();
  private sourceGameManager: SourceGameManager;

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
    private formationRepository: FormationRepository,
    private structureRepository: StructureRepository,
    protected chatMessageRepository: ChatMessageRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    public nameService: SuperElfNameService,
    public dateFormatter: DateFormatter,
    private authService: AuthService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.sourceGameManager = new SourceGameManager(gameRepository);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      // this.statisticsCache.set(AgainstSide.Home, new Map<number,StatisticsMap>());
      // this.statisticsCache.set(AgainstSide.Away, new Map<number,StatisticsMap>());
      this.setPool(pool);

      this.route.params.subscribe((params) => {
        this.leagueName = params["leagueName"];

        const poolCompetition = pool.getCompetition(this.leagueName);
        if (poolCompetition === undefined) {
          this.processing.set(false);
          throw Error("competitionSport not found");
        }
        const user = this.authService.getUser();

        // -- GETTING STRUCTURE FOR COMPETITION this.leagueName
        this.structureRepository.getObject(poolCompetition).subscribe({
          next: (structure: Structure) => {
            const round = structure.getSingleCategory().getRootRound();
            const firstPoule =
              this.leagueName === LeagueName.SuperCup ||
              this.leagueName === LeagueName.Competition;
            const poule: Poule = firstPoule
              ? round.getFirstPoule()
              : this.structureRepository.getPouleFromPouleId(
                  round,
                  +params.pouleId
                );
            this.poolPoule = poule;

            // -- determine gameRoundNumbers
            const sportVariant = poolCompetition.getSingleSport().getVariant();
            const currentGameRoundNr = this.getCurrentSourceGameRoundNr(
              poule,
              sportVariant
            );
            // @TODO CDK
            // const viewPeriod =
            //   pool.getViewPeriodByRoundNumber(currentGameRoundNr);
            const gameRoundNrs: number[] = this.getGameRoundNumbers(
              poule,
              sportVariant
            );
            const startLocations = this.getStartLocationsFromGameRoundNrs(
              poule,
              gameRoundNrs
            );

            // -- GETTING POOLUSERS FOR STARTLOCATIONS
            this.poolUserRepository
              .getObjects(pool, this.leagueName, startLocations)
              .subscribe((poolUsers: PoolUser[]) => {
                this.poolUserFromSession = poolUsers.find(
                  (poolUser: PoolUser) => poolUser.getUser() === user
                );
                const poolCompetitors = pool.getCompetitors(this.leagueName);
                this.initPouleCompetitors(poule, poolCompetitors);
                this.poolStartLocationMap = new StartLocationMap(
                  poolCompetitors
                );

                // @TODO CDK
                // // -- GETTING FORMATIONS
                // const getFormationRequests: Observable<S11Formation>[] = [];
                // if (this.homeCompetitor !== undefined) {
                //   getFormationRequests.push(
                //     this.formationRepository.getObject(
                //       this.homeCompetitor.getPoolUser(),
                //       viewPeriod
                //     )
                //   );
                // }
                // if (this.awayCompetitor !== undefined) {
                //   getFormationRequests.push(
                //     this.formationRepository.getObject(
                //       this.awayCompetitor.getPoolUser(),
                //       viewPeriod
                //     )
                //   );
                // }
                // forkJoin(getFormationRequests).subscribe({
                //   next: (formations: S11Formation[]) => {
                //     formations.forEach((formation: S11Formation) => {
                //       if (
                //         this.homeCompetitor !== undefined &&
                //         this.homeCompetitor.getPoolUser() ===
                //           formation.getPoolUser()
                //       ) {
                //         this.formationsMap.set(AgainstSide.Home, formation);
                //       }
                //       if (
                //         this.awayCompetitor !== undefined &&
                //         this.awayCompetitor.getPoolUser() ===
                //           formation.getPoolUser()
                //       ) {
                //         this.formationsMap.set(AgainstSide.Away, formation);
                //       }
                //     });

                //     // source
                //     this.getSourceStructure(
                //       pool.getSourceCompetition()
                //     ).subscribe({
                //       next: (structure: Structure) => {
                //         const sourcePoule = structure
                //           .getSingleCategory()
                //           .getRootRound()
                //           .getFirstPoule();
                //         this.sourcePoule = sourcePoule;

                //         const competitors = sourcePoule
                //           .getCompetition()
                //           .getTeamCompetitors();
                //         this.startLocationMap = new StartLocationMap(
                //           competitors
                //         );

                // @TODO CDK
                // this.gameRounds = gameRoundNrs.map(
                //   (gameRoundNr: number): GameRound => {
                //     return viewPeriod.getGameRound(gameRoundNr);
                //   }
                // );

                // const gameRound =
                //   viewPeriod.getGameRound(currentGameRoundNr);
                // if (gameRound !== undefined) {
                //   // init scroller
                //   const idx = this.gameRounds.indexOf(gameRound);
                //   if (idx >= 0) {
                //     this.gameRounds = this.gameRounds
                //       .splice(idx)
                //       .concat([], this.gameRounds);
                //   }
                //   this.setGameRoundAndGetStatistics(pool, gameRound);
                // }
                //         this.processing.set(false);
                //       },
                //     });
                //   },
                //   error: (e) => {
                //     console.log(e);
                //   },
                // });

                if (this.poolUserFromSession) {
                  this.chatMessageRepository
                    .getNrOfUnreadObjects(poule.getId(), pool)
                    .subscribe({
                      next: (nrOfUnreadMessages: number) => {
                        this.nrOfUnreadMessages = nrOfUnreadMessages;
                      },
                    });
                }
              });

            // this.initCurrentGameRound(competitionConfig, currentViewPeriod);
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
        });
      });
    });
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

  private initPouleCompetitors(
    poolPoule: Poule,
    poolCompetitors: PoolCompetitor[]
  ): void {
    const homeStartLocation = poolPoule.getPlace(1).getStartLocation();
    if (homeStartLocation) {
      this.homeCompetitor = poolCompetitors.find((competitor: PoolCompetitor) =>
        competitor.getStartLocation().equals(homeStartLocation)
      );
    }
    const awayStartLocation = poolPoule.getPlace(2).getStartLocation();
    if (awayStartLocation) {
      this.awayCompetitor = poolCompetitors.find((competitor: PoolCompetitor) =>
        competitor.getStartLocation().equals(awayStartLocation)
      );
    }
  }

  getCurrentSourceGameRoundNr(
    poule: Poule,
    sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame
  ): number {
    if (
      sportVariant instanceof AgainstH2h ||
      sportVariant instanceof AgainstGpp
    ) {
      const firstInPogress = poule
        .getAgainstGames()
        .find((game: AgainstGame) => game.getState() === GameState.InProgress);
      if (firstInPogress !== undefined) {
        return firstInPogress.getGameRoundNumber();
      }

      const lastFinished = poule
        .getAgainstGames()
        .slice()
        .reverse()
        .find((game: AgainstGame) => game.getState() === GameState.Finished);
      if (lastFinished !== undefined) {
        return lastFinished.getGameRoundNumber();
      }
      const firstCreated = poule
        .getAgainstGames()
        .find((game: AgainstGame) => game.getState() === GameState.Created);
      if (firstCreated !== undefined) {
        return firstCreated.getGameRoundNumber();
      }
    } else {
      const firstInPogress = poule
        .getTogetherGames()
        .find((game: TogetherGame) => game.getState() === GameState.InProgress);
      if (firstInPogress !== undefined) {
        return firstInPogress.getTogetherPlaces()[0].getGameRoundNumber();
      }

      const lastFinished = poule
        .getTogetherGames()
        .slice()
        .reverse()
        .find((game: TogetherGame) => game.getState() === GameState.Finished);
      if (lastFinished !== undefined) {
        return lastFinished.getTogetherPlaces()[0].getGameRoundNumber();
      }
      const firstCreated = poule
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

  getPoolGamePoints(
    currentGameRound: GameRound,
    competitor: PoolCompetitor
  ): number {
    const poolGame = this.getCurrentPoolGame(currentGameRound);
    if (poolGame === undefined) {
      return 0;
    }
    const finalScore = poolGame.getScores()[0];
    if (finalScore === undefined) {
      return 0;
    }
    const side = this.hasPoolCompetitor(poolGame, AgainstSide.Home, competitor)
      ? AgainstSide.Home
      : AgainstSide.Away;

    return side === AgainstSide.Home
      ? finalScore.getHome()
      : finalScore.getAway();
  }

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

  setGameRoundAndGetStatistics(
    pool: Pool,
    gameRound: GameRound | undefined
  ): void {
    this.processingGameRound.set(true);

    const editPeriod = this.getMostRecentEndedEditPeriod(pool);

    if (gameRound === undefined || editPeriod === undefined) {
      console.error("gameRound or editPeriod is undefined");
      this.processingGameRound.set(false);
      return;
    }

    this.sourceGameManager
      .getAgainstGames(
        this.sourcePoule,
        editPeriod.getViewPeriod(),
        gameRound.number
      )
      .subscribe({
        next: (games: AgainstGame[]) => {
          this.sourceGames = games;
          // this.sideMap = this.getSideMap(games);

          if (this.gameRoundCacheMap.has(gameRound.number)) {
            this.currentGameRound = gameRound;
            this.processingGameRound.set(false);
            return;
          }

          const homeFormation = this.formationsMap.get(AgainstSide.Home);
          const awayFormation = this.formationsMap.get(AgainstSide.Away);
          if (homeFormation === undefined || awayFormation === undefined) {
            return;
          }

          let homeProcessing = true;
          let awayProcessing = true;

          this.statisticsRepository
            .getGameRoundObjects(
              homeFormation,
              gameRound,
              this.statisticsGetter
            )
            .subscribe({
              next: () => {
                this.currentGameRound = gameRound;
                homeProcessing = false;
                if (!awayProcessing) {
                  this.gameRoundCacheMap.set(gameRound.number, true);
                  this.processingGameRound.set(false);
                }
              },
            });

          this.statisticsRepository
            .getGameRoundObjects(
              awayFormation,
              gameRound,
              this.statisticsGetter
            )
            .subscribe({
              next: () => {
                this.currentGameRound = gameRound;
                awayProcessing = false;
                if (!homeProcessing) {
                  this.gameRoundCacheMap.set(gameRound.number, true);
                  this.processingGameRound.set(false);
                }
              },
            });
        },
      });
  }

  hasPoolCompetitor(
    game: AgainstGame,
    side: AgainstSide,
    competitor: PoolCompetitor
  ): boolean {
    return game
      .getSidePlaces(side)
      .some((gamePlace: AgainstGamePlace): boolean => {
        const startLocation = gamePlace.getPlace().getStartLocation();
        return startLocation
          ? this.poolStartLocationMap.getCompetitor(startLocation) ===
              competitor
          : false;
      });
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  getFormationPlacesLines(
    sourceGame: AgainstGame,
    team: Team
  ): FormationPlacesLine[] {
    const homeFormationPlaces = this.getFormationPlaces(
      sourceGame,
      AgainstSide.Home,
      team
    );
    const awayFormationPlaces = this.getFormationPlaces(
      sourceGame,
      AgainstSide.Away,
      team
    );

    const minNrOfItems = Math.max(
      ...[homeFormationPlaces.length, awayFormationPlaces.length]
    );
    const lines: FormationPlacesLine[] = [];
    for (let i = 0; i < minNrOfItems; i++) {
      lines.push({
        home: homeFormationPlaces.shift(),
        away: awayFormationPlaces.shift(),
      });
    }
    return lines;
  }

  getFormationPlaces(
    sourceGame: AgainstGame,
    side: AgainstSide,
    team: Team
  ): (S11FormationPlace | undefined)[] {
    const formation = this.formationsMap.get(side);
    if (formation === undefined) {
      return [];
    }
    return formation
      .getPlaces()
      .filter((formationPlace: S11FormationPlace): boolean => {
        const s11Player = formationPlace.getPlayer();
        if (s11Player === undefined) {
          return false;
        }
        return (
          s11Player.getPlayer(team, sourceGame.getStartDateTime()) !== undefined
        );
      });
  }

  protected getTeams(sourceGame: AgainstGame): Team[] {
    return sourceGame
      .getSidePlaces()
      .map((sideGamePlace: AgainstGamePlace): Team => {
        const startLocation = sideGamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          throw new Error("unknown team");
        }
        const competitor = <TeamCompetitor>(
          this.startLocationMap.getCompetitor(startLocation)
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
    game: AgainstGame,
    side: AgainstSide
  ): (Competitor | undefined)[] {
    return game
      .getSidePlaces(side)
      .map((gamePlace: AgainstGamePlace): Competitor | undefined => {
        if (gamePlace === undefined) {
          return undefined;
        }
        const startLocation = gamePlace.getPlace().getStartLocation();
        return startLocation
          ? this.startLocationMap.getCompetitor(startLocation)
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

  getAgainstSide(sourceGame: AgainstGame, team: Team): AgainstSide {
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
              this.startLocationMap.getCompetitor(startLocation)
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

  linkToPoolUser(poolUser: PoolUser): void {
    const gameRound = this.currentGameRound;
    this.router.navigate([
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      gameRound ? gameRound.number : 0,
    ]);
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
}

interface FormationPlacesLine {
  home: S11FormationPlace | undefined;
  away: S11FormationPlace | undefined;
}
