import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competition, Competitor, CompetitorBase, Player, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { concatMap, map, Observable, of } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { GamePicker } from '../../lib/gameRound/gamePicker';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player, StatisticsMap } from '../../lib/player';
import { PointsCalculator } from '../../lib/points/calculator';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-game-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceGameComponent extends PoolComponent implements OnInit {
  public game: AgainstGame | undefined;
  // public pool!: Pool;
  // private pointsCalculator!: PointsCalculator;
  // public currentGameRound: GameRound | undefined;
  private startLocationMap!: StartLocationMap;

  // @Input() team: Team | undefined;
  public processing = true;
  // public processingGames = false;
  // public currentGame: AgainstGame | undefined;
  // public currentStatistics: Statistics | undefined;
  // public currentPoints: number | undefined;
  // public sourceStructure: Structure | undefined;
  // public startLocationMap!: StartLocationMap;

  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;
  // private sliderGameRounds: (GameRound | undefined)[] = [];

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
    private myNavigation: MyNavigation) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.route.params.subscribe(params => {
        const gameRound = this.getGameRoundByNumber(+params['gameRound']);

        this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
          next: (structure: Structure) => {
            const poule = structure.getSingleCategory().getRootRound().getFirstPoule();

            this.gameRepository.getSourceObjects(poule, gameRound).subscribe({
              next: (games: AgainstGame[]) => {
                const game = games.find((game: AgainstGame) => game.getId() === +params['gameId']);
                if (game) {
                  const competitors = game.getPoule().getCompetition().getTeamCompetitors();
                  this.startLocationMap = new StartLocationMap(competitors);

                  // const teams = [this.getTeam(AgainstSide.Home), this.getTeam(AgainstSide.Away)];
                  // this.playerRepository.getObjects(pool.getSourceCompetition(), pool.getCreateAndJoinPeriod()).subscribe({
                  //   next: (scoutedPlayers: ScoutedPlayer[]) => {
                  //     scoutedPlayers.forEach(scoutedPlayer => this.addToScoutingList(scoutedPlayer))
                  //   },
                  //   error: (e) => {
                  //     this.setAlert('danger', e); this.processing = false;
                  //   },
                  //   complete: () => this.processing = false
                  // });
                }
                this.game = game;
              },
              complete: () => this.processing = false
            });
          }
        });

      });
      // this.initPoolUser(pool);
      // this.initScoutedPlayers(pool);
    });

    // this.pointsCalculator = new PointsCalculator(this.pool.getCompetitionConfig());

    // this.startLocationMap = new StartLocationMap(this.pool.getSourceCompetition().getTeamCompetitors());

    // this.initSliderGameRounds();

    // this.updateGameRound();







  }

  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }

  getSourceStructure(competition: Competition): Observable<Structure> {
    // if (this.sourceStructure !== undefined) {
    //   return of(this.sourceStructure);
    // }
    return this.structureRepository.getObject(competition);
  }

  getGameRoundByNumber(gameRoundNumber: number): GameRound {
    const viewPeriods = this.pool.getCompetitionConfig().getViewPeriods();

    let viewPeriod = viewPeriods.shift();
    while (viewPeriod !== undefined) {
      try {
        return viewPeriod.getGameRound(gameRoundNumber);
      } catch (any) {

      }
      viewPeriod = viewPeriods.shift();
    }
    throw new Error('gameRound could not be found for number "' + gameRoundNumber + '"');
  }

  getCompetitors(game: AgainstGame, side: AgainstSide): (Competitor | undefined)[] {
    return game.getSidePlaces(side).map((gamePlace: AgainstGamePlace): Competitor | undefined => {
      if (gamePlace === undefined) {
        return undefined;
      }
      const startLocation = gamePlace.getPlace().getStartLocation();
      return startLocation ? this.startLocationMap.getCompetitor(startLocation) : undefined;
    });
  }

  getTeamCompetitor(sideCompetitor: Competitor | undefined): TeamCompetitor | undefined {
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
