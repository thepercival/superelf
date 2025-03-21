import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, GameState, Place, Poule, SportRoundRankingItem, StartLocationMap, Structure, StructureNameService, Team, TeamCompetitor, TogetherGame, TogetherSportRoundRankingCalculator } from 'ngx-sport';
import { concatMap, Observable } from 'rxjs';
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
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameRoundScrollerComponent } from '../gameRound/gameRoundScroller.component';
import { WorldCupNavBarComponent } from '../../shared/poolmodule/poolNavBar/worldcupNavBar.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { GameScrollerComponent } from '../game/source/gameScroller.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { faMessage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GameTableHeaderComponent } from '../game/source/game-tableheader.component';
import { DateFormatter } from '../../lib/dateFormatter';
import { GameTableRowComponent } from "../game/source/game-tablebody.component";
import { ActiveGameRoundsCalculator } from '../../lib/gameRound/activeGameRoundsCalculator';
import { GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRoundViewType } from '../../lib/gameRound/viewType';
import { ViewPeriod } from '../../lib/periods/viewPeriod';


@Component({
  selector: "app-pool-allinonegame-schedule",
  standalone: true,
  imports: [
    NgbAlertModule,
    FontAwesomeModule,
    GameRoundScrollerComponent,
    WorldCupNavBarComponent,
    PoolNavBarComponent,
    GameTableHeaderComponent,
    NgIf,
    GameTableRowComponent,
    NgbNavModule,
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
  public currentViewPeriod: WritableSignal<ViewPeriod | undefined> =
    signal(undefined);
  public viewGameRounds: WritableSignal<GameRound[]> = signal([]);

  public sourceGameRoundGames: AgainstGame[] = [];
  public sourceAgainstGamesMap: Map<number, AgainstGame[]> = new Map();

  public poolUsersStartLocationMap: StartLocationMap | undefined;
  public formationMap: Map<number, S11Formation> | undefined;

  public poule: Poule | undefined;
  public leagueName!: LeagueName;
  public nrOfUnreadMessages = 0;
  public active = 1;

  public activeGameRoundsCalculator: ActiveGameRoundsCalculator;

  public processingGames: WritableSignal<boolean> = signal(true);
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
    gameRoundRepository: GameRoundRepository,
    public imageRepository: ImageRepository,
    protected chatMessageRepository: ChatMessageRepository,
    public cssService: CSSService,
    private authService: AuthService,
    private myNavigation: MyNavigation,
    public dateFormatter: DateFormatter
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.activeGameRoundsCalculator = new ActiveGameRoundsCalculator(
      2,
      1,
      gameRoundRepository
    );
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
                  this.poolUsersStartLocationMap = new StartLocationMap(
                    poolCompetitors
                  );
                  const togetherRankingCalculator =
                    new TogetherSportRoundRankingCalculator(competitionSport, [
                      GameState.InProgress,
                      GameState.Finished,
                    ]);
                  this.sportRankingItems =
                    togetherRankingCalculator.getItemsForPoule(poule);

                  // this.gameRounds =
                  //   this.getCurrentViewPeriod(pool).getGameRounds();

                  this.route.params.subscribe((params) => {
                    this.getSourceStructure(
                      pool.getSourceCompetition()
                    ).subscribe({
                      next: (structure: Structure) => {
                        this.sourceStructure = structure;

                        this.activeGameRoundsCalculator
                          .determineActiveGameRound(
                            pool.getCompetitionConfig(),
                            pool.getCurrentViewPeriod(),
                            GameRoundViewType.Games
                          )
                          .pipe(
                            concatMap((activeGameRound: GameRound) => {
                              this.currentGameRound.set(activeGameRound);
                              return this.activeGameRoundsCalculator.getActiveGameRounds(
                                pool.getCompetitionConfig(),
                                pool.getCurrentViewPeriod(),
                                activeGameRound
                              );
                            })
                          )
                          .subscribe({
                            next: (activeGameRounds: GameRound[]) => {
                              this.viewGameRounds.set(activeGameRounds);
                              this.processing.set(false);
                            },
                          });
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

  get Finished(): GameState {
    return GameState.Finished;
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

  updateGameRound(
    gameRound: GameRound | undefined,
    gameId?: number | undefined
  ): void {
    if (gameRound === undefined) {
      return;
    }

    this.processingGames.set(true);

    this.currentGameRound.set(gameRound);
    const poule = this.sourceStructure
      .getSingleCategory()
      .getRootRound()
      .getFirstPoule();

    // @TODO CDK
    // if (gameRound.hasAgainstGames()) {
    //   this.updateSourceGame(this.getDefaultGame(gameRound.getAgainstGames()));
    //   this.processing.set(false);
    //   this.processingGames.set(false);
    //   return;
    // }

    // this.gameRepository.getSourceObjects(poule, gameRound).subscribe({
    //   next: (games: AgainstGame[]) => {
    //     this.sourceGameRoundGames = games;
    //   },
    //   complete: () => {
    //     this.processing.set(false);
    //     this.processingGames.set(false);
    //   },
    // });
  }

  // updateGameRounds(gameRoundsourceGame: AgainstGame): void {
  //   this.currentSourceGame = sourceGame;
  // }

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

  navigateToChat(pool: Pool, poolPoule: Poule): void {
    this.router.navigate([
      "/pool/chat",
      pool.getId(),
      this.leagueName,
      poolPoule.getId(),
    ]);
  }

  navigateBack() {
    this.myNavigation.back();
  }
}

export interface S11FormationMap extends Map<number,S11Formation>{};