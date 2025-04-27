
import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, FootballLine, Competition, AgainstGame, Structure, AgainstSide } from 'ngx-sport';
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
import { FormationLineViewComponent, PlayerLink } from '../formation/line/view.component';
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
import { S11PlayerModalComponent } from '../player/playerinfo.modal.component';
import { ScorePointsMap } from '../../lib/score/points';
import { SourceAgainstGamesGetter } from '../../lib/gameRound/sourceAgainstGamesGetter';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { TeamFinder } from '../../lib/teamFinder';
import { BadgeCategory } from '../../lib/achievement/badge/category';

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

  public assembleFormation: WritableSignal<S11Formation | undefined> = signal(undefined);
  public transferFormation: WritableSignal<S11Formation | undefined> = signal(undefined);

  public processingStatistics: WritableSignal<boolean> = signal(true);

  public poolUser: PoolUser | undefined;
  public leagueName!: LeagueName;

  private teamFinder: TeamFinder|undefined;    
  public gameRoundGetter: GameRoundGetter;
  public statisticsGetter = new StatisticsGetter();
  public nameService = new NameService();
  
  public sourceAgainstGamesGetter: SourceAgainstGamesGetter;
  public activeGameRoundsCalculator: ActiveViewGameRoundsCalculator;
  public sourceStructure: Structure | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public sourceAgainstGamesMap: Map<number, AgainstGame[]> = new Map();
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
    gameRepository: GameRepository,
    protected authService: AuthService,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.gameRoundGetter = new GameRoundGetter(gameRoundRepository);
    this.activeGameRoundsCalculator = new ActiveViewGameRoundsCalculator(
      this.gameRoundGetter
    );
    this.sourceAgainstGamesGetter = new SourceAgainstGamesGetter(
          gameRepository
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
        this.teamFinder = new TeamFinder(competitionConfig.getSourceCompetition().getTeamCompetitors());
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
                
                forkJoin(this.setFormations(poolUser)).subscribe({
                  next: (formations: S11Formation[]) => {
                    this.determineActiveGameRound(
                      competitionConfig,
                      currentViewPeriod,
                      +params.gameRoundNr
                    ).subscribe({
                      next: (activeGameRound: GameRound) => {
                        this.currentGameRound.set(activeGameRound);
                      },
                    });
                  },
                  error: (e) => {
                    this.setAlert("danger", e);
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
    this.processingStatistics.set(true);

    const competitionConfig = poolUser.getPool().getCompetitionConfig();



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

          forkJoin(this.setGameRoundsAndGetStatistics(activeGameRounds)).subscribe({
            next: () => {
              this.processingStatistics.set(false);
            },
            error: (e) => {
              this.setAlert("danger", e);
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

  setFormations(poolUser: PoolUser): Observable<S11Formation>[] {
    const competitonConfig = poolUser.getPool().getCompetitionConfig();
    const formations: Observable<S11Formation>[] = [];

    if(this.assembleFormation() === undefined) {
      formations.push( 
        this.formationRepository.getObject(poolUser, competitonConfig.getAssemblePeriod().getViewPeriod()).pipe(
          concatMap((formation: S11Formation) => {
            this.assembleFormation.set(formation);
            return of(formation);
          })
        )
      );
    }
    
    const transferViewPeriod = competitonConfig.getTransferPeriod().getViewPeriod();
    if(this.transferFormation() === undefined
      && (new Date()).getTime() > transferViewPeriod.getStartDateTime().getTime() ) {
      formations.push( 
        this.formationRepository.getObject(poolUser, transferViewPeriod).pipe(
          concatMap((formation: S11Formation) => {
            this.transferFormation.set(formation);
            return of(formation);
          })
        )
      );
    }

    return formations;
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
    if (gameRoundNr > 0) {
      return this.gameRoundGetter.getGameRound(
        competitionConfig,
        viewPeriod,
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

  setGameRoundsAndGetStatistics(gameRounds: GameRound[]): Observable<void>[] {
    const assembleFormation = this.assembleFormation();
    const transferFormation = this.transferFormation();

    return gameRounds.map((gameRound) => {
    
      let formation: S11Formation | undefined = undefined;
      if( assembleFormation?.getViewPeriod() === gameRound.viewPeriod ) {
        formation = assembleFormation;
      } else if( transferFormation?.getViewPeriod() === gameRound.viewPeriod ) {
        formation = transferFormation;
      }
      if( formation === undefined) {
        throw new Error('formation not found from gameRoundNr "' + gameRound.number + '"');
      }
    
      return this.statisticsRepository.getGameRoundObjects(
        formation,
        gameRound,
        this.statisticsGetter
      )
      
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

  openPlayerModal(link: PlayerLink, competitionConfig: CompetitionConfig): void {
    
    this.getSourceStructure(competitionConfig.getSourceCompetition()).subscribe(
      {
        next: (sourceStructure: Structure) => {
          const poule = sourceStructure.getSingleCategory().getRootRound().getFirstPoule();

          this.sourceAgainstGamesGetter.getGameRoundGames(poule, link.gameRound).subscribe({
              next: (games: AgainstGame[]) => {
                const sourceAgainstGame = this.findGame(games, link.s11Player);
                if(sourceAgainstGame) {
                  const activeModal = this.modalService.open(S11PlayerModalComponent);
                  activeModal.componentInstance.s11Player = link.s11Player;
                  activeModal.componentInstance.sourceAgainstGame = sourceAgainstGame;
                  activeModal.componentInstance.scorePointsMap = competitionConfig.getScorePointsMap();
                  activeModal.result.then(
                    () => {},
                    (reason) => {}
                  );
                }
              },
            });
        },
      }
    );
    
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

  private findGame(gameRoundGames: AgainstGame[], s11Player: S11Player): AgainstGame|undefined {

    const teamFinder = this.teamFinder;
    if( teamFinder === undefined) {
      return undefined;
    }

    return gameRoundGames.find((game: AgainstGame): boolean => {

      const homeTeam = teamFinder.findTeam(game, AgainstSide.Home);
      if( homeTeam !== undefined && s11Player.getPlayer(homeTeam, game.getStartDateTime()) !== undefined ) {
        return true;
      }
      const awayTeam = teamFinder.findTeam(game, AgainstSide.Away);
      return ( awayTeam !== undefined && s11Player.getPlayer(awayTeam, game.getStartDateTime()) !== undefined );
    });
  }

  inAfterTransfer(pool: Pool): boolean {
    return (
      pool.getTransferPeriod().getEndDateTime().getTime() < new Date().getTime()
    );
  }
}
