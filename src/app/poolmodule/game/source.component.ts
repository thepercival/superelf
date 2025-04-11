import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { forkJoin, map, Observable } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { AgainstGameCardEvent, AgainstGameEvent, AgainstGameGoalEvent, AgainstGameLineupItem } from '../../lib/ngx-sport/game/football';
import { FootballCard, FootballEvent, FootballGoal } from '../../lib/score';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { AgainstGameTitleComponent } from './source/title.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFutbol, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { facCard } from '../../shared/poolmodule/icons';

@Component({
  selector: "app-game-source",
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAlertModule,
    LineIconComponent,
    SuperElfIconComponent,
    AgainstGameTitleComponent,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: "./source.component.html",
  styleUrls: ["./source.component.scss"],
})
export class SourceGameComponent extends PoolComponent implements OnInit {
  public game: AgainstGame | undefined;

  private startLocationMap!: StartLocationMap;
  private lineupSidesMap: Map<AgainstSide, AgainstGameLineupItem[]> = new Map();
  private eventsSidesMap: Map<
    AgainstSide,
    (AgainstGameGoalEvent | AgainstGameCardEvent)[]
  > = new Map();

  public processingLineups = true;
  public processingEvents = true;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private playerRepository: PlayerRepository,
    private statisticsRepository: StatisticsRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.route.params.subscribe((params) => {
      
        this.getSourceStructure(pool.getSourceCompetition()).subscribe({
          next: (structure: Structure) => {
            const poule = structure
              .getSingleCategory()
              .getRootRound()
              .getFirstPoule();

            this.gameRepository
              .getSourceObjects(poule, +params["gameRound"])
              .subscribe({
                next: (games: AgainstGame[]) => {
                  const game = games.find(
                    (game: AgainstGame) => game.getId() === +params["gameId"]
                  );
                  if (game) {
                    const competitors = game
                      .getPoule()
                      .getCompetition()
                      .getTeamCompetitors();
                    this.startLocationMap = new StartLocationMap(competitors);

                    // (AgainstGameGoalEvent | AgainstGameCardEvent)[]
                    // AgainstGameLineupItem[]

                    const lineupRequests = [
                      AgainstSide.Home,
                      AgainstSide.Away,
                    ].map((side: AgainstSide) => {
                      return this.gameRepository
                        .getSourceObjectLineup(game, side)
                        .pipe(
                          map((lineupItems: AgainstGameLineupItem[]) => {
                            this.lineupSidesMap.set(side, lineupItems);
                          })
                        );
                    });
                    forkJoin(lineupRequests).subscribe({
                      next: (results) => {
                        this.processingLineups = false;
                      },
                    });

                    const eventsRequests = [
                      AgainstSide.Home,
                      AgainstSide.Away,
                    ].map((side: AgainstSide) => {
                      return this.gameRepository
                        .getSourceObjectEvents(game, side)
                        .pipe(
                          map(
                            (
                              events: (
                                | AgainstGameGoalEvent
                                | AgainstGameCardEvent
                              )[]
                            ) => {
                              this.eventsSidesMap.set(side, events);
                            }
                          )
                        );
                    });
                    forkJoin(eventsRequests).subscribe({
                      next: (results) => {
                        this.processingEvents = false;
                      },
                    });

                    // this.gameRepository.getSourceObjectLineup(game, AgainstSide.Home).subscribe({
                    //   next: (lineupItems: AgainstGameLineupItem[]) => {
                    //     this.lineupSidesMap.set(AgainstSide.Home, lineupItems);
                    //   },
                    //   error: (e) => {
                    //     this.setAlert('danger', e); this.processing.set(false);
                    //   },
                    //   complete: () => this.processing.set(false)
                    // });
                  }
                  this.game = game;
                },
                complete: () => this.processing.set(false),
              });
          },
        });
      });
    });
  }

  getLineUp(side: AgainstSide): AgainstGameLineupItem[] {
    const item = this.lineupSidesMap.get(side);
    return item !== undefined ? item : [];
  }

  getEvents(side: AgainstSide): AgainstGameEvent[] {
    const item = this.eventsSidesMap.get(side);
    return item !== undefined ? item : [];
  }

  instanceOfGoalEvent(event: any): event is AgainstGameGoalEvent {
    return "score" in event;
  }

  instanceOfCardEvent(event: any): event is AgainstGameCardEvent {
    return "color" in event;
  }

  getFootballEvent(
    eventItem: AgainstGameGoalEvent | AgainstGameCardEvent
  ): FootballEvent {
    if (this.instanceOfGoalEvent(eventItem)) {
      return eventItem.score;
    }
    return eventItem.color;
  }

  getIconDefintion(event: FootballEvent): IconDefinition {
    switch (event) {
      case FootballGoal.Normal:
      case FootballGoal.Own:
        return faFutbol;
      case FootballGoal.Assist:
        return faFutbol;
      case FootballGoal.Penalty:
        return faFutbol;
      case FootballCard.Yellow:
      case FootballCard.Red:
        return facCard;
    }
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

  getTeamCompetitor(
    sideCompetitor: Competitor | undefined
  ): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  getTeam(sideCompetitor: Competitor | undefined): Team | undefined {
    const teamCompetitor = this.getTeamCompetitor(sideCompetitor);
    return teamCompetitor?.getTeam() ?? undefined;
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  // private initSliderGameRounds(): void {
  //   this.sliderGameRounds = this.s11Player.getViewPeriod().getGameRounds().slice();
  //   this.sliderGameRounds.unshift(undefined);
  //   if (this.currentGameRound !== undefined) {
  //     const idx = this.sliderGameRounds.indexOf(this.currentGameRound);
  //     if (idx >= 0) {
  //       this.sliderGameRounds = this.sliderGameRounds.splice(idx).concat(this.sliderGameRounds);
  //     }
  //   }
  // }

  // getTeamImageUrl(player: Player): string {
  //   return this.imageRepository.getTeamUrl(player.getTeam());
  // }

  // getPlayerImageUrl(player: Player): string {
  //   return this.imageRepository.getPlayerUrl(player);
  // }

  // updateGameRound(): void {
  //   const currentGameRound = this.currentGameRound;
  //   if (currentGameRound === undefined) {
  //     this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player);
  //     this.currentStatistics = undefined;
  //     this.currentGame = undefined;
  //     return;
  //   }
  //   this.currentStatistics = this.s11Player.getGameStatistics(currentGameRound.getNumber());

  //   if (currentGameRound.hasAgainstGames()) {
  //     this.currentGame = (new GamePicker(this.pool.getSourceCompetition(), currentGameRound)).getGame(this.s11Player);
  //     return;
  //   }
  //   this.processingGames = true;
  //   this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
  //     next: (structure: Structure) => {
  //       this.sourceStructure = structure;
  //       const sourcePoule = structure.getSingleCategory().getRootRound().getFirstPoule();

  //       this.gameRepository.getSourceObjects(sourcePoule, currentGameRound).subscribe({
  //         next: (againstGames: AgainstGame[]) => {
  //           this.currentGame = (new GamePicker(this.pool.getSourceCompetition(), currentGameRound)).getGame(this.s11Player);
  //         },
  //         complete: () => this.processingGames = false
  //       });
  //     }
  //   });
  // }

  // getSourceStructure(competition: Competition): Observable<Structure> {
  //   if (this.sourceStructure !== undefined) {
  //     return of(this.sourceStructure);
  //   }
  //   return this.structureRepository.getObject(competition);
  // }

  // previousGameRound(): void {
  //   this.currentGameRound = this.sliderGameRounds.pop();
  //   this.sliderGameRounds.unshift(this.currentGameRound);
  //   this.updateGameRound();
  // }

  // nextGameRound(): void {
  //   this.sliderGameRounds.push(this.sliderGameRounds.shift());
  //   this.currentGameRound = this.sliderGameRounds.shift();
  //   this.sliderGameRounds.unshift(this.currentGameRound);
  //   this.updateGameRound();
  // }

  // getCurrentGameRoundLabel(): string {
  //   if (this.currentGameRound === undefined) {
  //     return 'alle speelronden';
  //   }
  //   return 'speelronde ' + this.currentGameRound.getNumber();
  // }

  // getCurrentGameRoundPoints(): number {
  //   if (this.currentGameRound === undefined) {
  //     return this.s11Player.getTotalPoints();
  //   }
  //   if (this.currentStatistics === undefined) {
  //     return 0;
  //   }
  //   return this.pointsCalculator.getPoints(this.s11Player.getLine(), this.currentStatistics);
  // }

  navigateBack() {
    this.myNavigation.back();
  }
}
