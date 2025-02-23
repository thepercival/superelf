import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, GameState, Place, Poule, SportRoundRankingItem, StartLocationMap, Structure, StructureNameService, Team, TeamCompetitor, TogetherGame, TogetherSportRoundRankingCalculator } from 'ngx-sport';
import { Observable } from 'rxjs';
import { AuthService } from '../../lib/auth/auth.service';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { S11Formation } from '../../lib/formation';
import { S11FormationPlace } from '../../lib/formation/place';
import { FormationRepository } from '../../lib/formation/repository';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
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
import { S11Player } from '../../lib/player';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { WorldCupNavBarComponent } from '../../shared/poolmodule/poolNavBar/worldcupNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { GameScrollerComponent } from '../game/source/gameScroller.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { faMessage, faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "app-pool-allinonegame-schedule",
  standalone: true,
  imports: [
    NgbAlertModule,
    FontAwesomeModule,
    GameRoundScrollerComponent,
    WorldCupNavBarComponent,
    PoolNavBarComponent,
    LineIconComponent,
    GameScrollerComponent,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: "./allinonegame.component.html",
  styleUrls: ["./allinonegame.component.scss"],
})
export class PoolAllInOneGameScheduleComponent
  extends PoolComponent
  implements OnInit
{
  public gameRounds: GameRound[] = [];
  public currentGameRound: GameRound | undefined;
  public sourceGameRoundGames: AgainstGame[] = [];
  public currentSourceGame: AgainstGame | undefined;
  private startLocationMap!: StartLocationMap;
  private sourceStartLocationMap!: StartLocationMap;
  public formationMap: Map<number, S11Formation> | undefined;

  public poule: Poule | undefined;
  public structureNameService!: StructureNameService;
  public leagueName!: LeagueName;
  public nrOfUnreadMessages = 0;

  public processingPoolUsers = true;
  public processingGames = true;
  // public poolUsers: PoolUser[] = [];
  public sportRankingItems!: SportRoundRankingItem[];
  private sourceStructure!: Structure;
  public faMessage = faMessage;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private formationRepository: FormationRepository,
    private poolUserRepository: PoolUserRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    protected chatMessageRepository: ChatMessageRepository,
    public cssService: CSSService,
    private authService: AuthService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.setLeagueName(pool.getCompetitions());
      const user = this.authService.getUser();
      this.poolUserRepository
        .getObjects(pool)
        .subscribe((poolUsers: PoolUser[]) => {
          // this.poolUsers = poolUsers;
          this.poolUserFromSession = poolUsers.find(
            (poolUser: PoolUser) => poolUser.getUser() === user
          );
          const competition = pool.getCompetition(this.leagueName);
          if (competition === undefined) {
            this.processing.set(false);
            throw Error("competitionSport not found");
          }

          const editPeriod = this.getMostRecentEndedEditPeriod(pool);
          if (editPeriod === undefined) {
            this.processing.set(false);
            throw Error("geen competitie periode gevonden");
          }
          this.formationRepository.getObjectMap(pool, editPeriod).subscribe({
            next: (formationMap: S11FormationMap) => {
              this.formationMap = formationMap;
              this.structureRepository.getObject(competition).subscribe({
                next: (structure: Structure) => {
                  const poolCompetitors = pool.getCompetitors(this.leagueName);
                  const round = structure.getSingleCategory().getRootRound();
                  const poule = round.getFirstPoule();
                  this.poule = poule;
                  const competitionSport = pool.getCompetitionSport(
                    this.leagueName
                  );
                  this.startLocationMap = new StartLocationMap(poolCompetitors);
                  this.structureNameService = new StructureNameService(
                    this.startLocationMap
                  );
                  const togetherRankingCalculator =
                    new TogetherSportRoundRankingCalculator(competitionSport, [
                      GameState.InProgress,
                      GameState.Finished,
                    ]);
                  this.sportRankingItems =
                    togetherRankingCalculator.getItemsForPoule(poule);

                  this.gameRounds =
                    this.getCurrentViewPeriod(pool).getGameRounds();

                  this.route.params.subscribe((params) => {
                    this.getSourceStructure(
                      pool.getSourceCompetition()
                    ).subscribe({
                      next: (structure: Structure) => {
                        this.sourceStructure = structure;

                        const gameRoundNumber =
                          this.getCurrentSourceGameRoundNumber(poule);
                        const gameRoundFromUrl =
                          this.getGameRoundByNumber(gameRoundNumber);
                        this.updateGameRound(gameRoundFromUrl, undefined);
                      },
                    });
                  });

                  if (this.poolUserFromSession && this.poule) {
                    this.chatMessageRepository
                      .getNrOfUnreadObjects(this.poule.getId(), pool)
                      .subscribe({
                        next: (nrOfUnreadMessages: number) => {
                          this.nrOfUnreadMessages = nrOfUnreadMessages;
                        },
                      });
                  }
                },
                error: (e: string) => {
                  this.setAlert("danger", e);
                  this.processing.set(false);
                },
              });
            },
            error: (e) => {
              this.setAlert("danger", e);
              this.processing.set(false);
            },
          });
        });
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

  get WorldCupLeagueName(): LeagueName {
    return LeagueName.WorldCup;
  }
  get Schedule(): NavBarItem {
    return NavBarItem.Schedule;
  }

  getCurrentSourceGameRoundNumber(poule: Poule): number {
    const lastFinished = poule
      .getTogetherGames()
      .slice()
      .reverse()
      .find((game: TogetherGame) => game.getState() === GameState.Finished);
    let grLastFinished: number | undefined = lastFinished
      ?.getTogetherPlaces()[0]
      .getGameRoundNumber();

    const lastInPogress = poule
      .getTogetherGames()
      .reverse()
      .find((game: TogetherGame) => game.getState() === GameState.InProgress);
    let grLastInPogress: number | undefined = lastInPogress
      ?.getTogetherPlaces()[0]
      .getGameRoundNumber();

    const lastCreated = poule
      .getTogetherGames()
      .reverse()
      .find((game: TogetherGame) => game.getState() === GameState.Created);
    let grLastCreated: number | undefined = lastCreated
      ?.getTogetherPlaces()[0]
      .getGameRoundNumber();

    // wanneer een gr in progress
    if (grLastInPogress !== undefined) {
      // wanneer er een recentere finished na komt
      if (grLastFinished !== undefined && grLastFinished > grLastInPogress) {
        return grLastFinished;
      }
      return grLastInPogress;
    }
    // pak de meest recente finish
    if (grLastFinished !== undefined) {
      return grLastFinished;
    }
    if (grLastCreated !== undefined) {
      return grLastCreated;
    }
    throw new Error("should be a gameroundnumber");
  }

  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  getSourceStructure(competition: Competition): Observable<Structure> {
    // if (this.sourceStructure !== undefined) {
    //   return of(this.sourceStructure);
    // }
    return this.structureRepository.getObject(competition);
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

  getGameRoundByNumber(gameRoundNumber: number): GameRound {
    const gameRound = this.gameRounds.find(
      (gameRound: GameRound) => gameRound.getNumber() === gameRoundNumber
    );

    if (gameRound !== undefined) {
      return gameRound;
    }
    throw new Error(
      'gameRound could not be found for number "' + gameRoundNumber + '"'
    );
  }

  updateGameRound(
    gameRound: GameRound | undefined,
    gameId?: number | undefined
  ): void {
    if (gameRound === undefined) {
      return;
    }

    this.processingGames = true;

    this.currentGameRound = gameRound;
    const poule = this.sourceStructure
      .getSingleCategory()
      .getRootRound()
      .getFirstPoule();

    if (gameRound.hasAgainstGames()) {
      this.updateSourceGame(this.getDefaultGame(gameRound.getAgainstGames()));
      this.processing.set(false);
      this.processingGames = false;
      return;
    }

    this.gameRepository
      .getSourceObjects(poule, this.currentGameRound)
      .subscribe({
        next: (games: AgainstGame[]) => {
          this.sourceGameRoundGames = games;
          let game = games.find((game: AgainstGame) => game.getId() === gameId);
          if (game == undefined) {
            game = this.getDefaultGame(games);
          }
          const competitors = game
            .getPoule()
            .getCompetition()
            .getTeamCompetitors();
          this.sourceStartLocationMap = new StartLocationMap(competitors);
          this.updateSourceGame(game);
        },
        complete: () => {
          this.processing.set(false);
          this.processingGames = false;
        },
      });
  }

  updateSourceGame(sourceGame: AgainstGame): void {
    this.currentSourceGame = sourceGame;
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  public getFormationPlaces(
    sourceGame: AgainstGame,
    side: AgainstSide,
    formationMap: S11FormationMap,
    sportRankingItem: SportRoundRankingItem
  ): S11FormationPlace[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if (poolUser === undefined) {
      return [];
    }
    const formation = formationMap.get(+poolUser.getId());
    const team = this.getTeam(sourceGame.getSidePlaces(side));
    if (formation === undefined || team === undefined) {
      return [];
    }
    return formation
      .getPlaces()
      .filter((formationPlace: S11FormationPlace): boolean => {
        return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
      });
  }

  protected getTeam(sideGamePlaces: AgainstGamePlace[]): Team | undefined {
    const teams = sideGamePlaces.map(
      (againstGamePlace: AgainstGamePlace): Team | undefined => {
        const startLocation = againstGamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          return undefined;
        }
        const competitor = <TeamCompetitor>(
          this.sourceStartLocationMap.getCompetitor(startLocation)
        );
        return competitor?.getTeam();
      }
    );
    return teams.find((team: Team | undefined): boolean => team !== undefined);
  }

  getPoolUser(sportRankingItem: SportRoundRankingItem): PoolUser {
    // console.log(sportRankingItem, this.startLocationMap);
    const startLocation = sportRankingItem
      .getPerformance()
      .getPlace()
      .getStartLocation();
    if (startLocation === undefined) {
      throw new Error("could not find pooluser");
    }
    const competitor = <PoolCompetitor>(
      this.startLocationMap.getCompetitor(startLocation)
    );
    const poolUser = competitor?.getPoolUser();
    if (poolUser === undefined) {
      throw new Error("could not find pooluser");
    }
    return poolUser;
  }

  navigateToSourceGame(pool: Pool, game: AgainstGame): void {
    this.router.navigate([
      "/pool/sourcegame",
      pool.getId(),
      game.getGameRoundNumber(),
      game.getId(),
    ]);
  }

  navigateToChat(pool: Pool, poolPoule: Poule): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      poolPoule.getId(),
    ]);
  }

  linkToPlayer(pool: Pool, s11Player: S11Player): void {
    const gameRound = this.currentGameRound?.getNumber() ?? 0;
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), gameRound] /*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/
    );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  getRouterLink(
    sportRankingItem: SportRoundRankingItem,
    gameRound: GameRound | undefined
  ): (string | number)[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if (poolUser == undefined) {
      throw new Error("could not find pooluser");
    }

    return [
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      gameRound ? gameRound.getNumber() : 0,
    ];
  }
}

export interface S11FormationMap extends Map<number,S11Formation>{};