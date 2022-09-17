import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, Competition, Player, StartLocationMap, Structure } from 'ngx-sport';
import { Observable, of } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { ViewPeriod } from '../../lib/period/view';
import { PointsCalculator } from '../../lib/points/calculator';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent extends PoolComponent implements OnInit {
  // public s11Player!: S11Player;
  public pool!: Pool;
  public viewPeriod!: ViewPeriod;
  private pointsCalculator!: PointsCalculator;
  public currentGameRound: GameRound | undefined;
  public gameRounds: (GameRound | undefined)[] = [];
  public againstGames: AgainstGame[] = [];

  // @Input() team: Team | undefined;
  public processing = true;
  public processingGames = false;

  //  public currentStatistics: Statistics | undefined;
  //  public currentPoints: number | undefined;
  public sourceStructure: Structure | undefined;
  public startLocationMap!: StartLocationMap;

  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private gameRoundRepository: GameRoundRepository,
    private statisticsRepository: StatisticsRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation,
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {

        this.setPool(pool);

        const competitionConfig = this.pool.getCompetitionConfig();
        const currentViewPeriod = competitionConfig.getViewPeriodByDate(new Date());
        if (currentViewPeriod === undefined) {
          return;
        }
        this.viewPeriod = currentViewPeriod;
        this.route.params.subscribe(params => {
          this.initGameRounds(+params.gameRound);
        });
      },
      error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
    })
  }

  private getCurrentGameRound(gameRoundParam: number): Observable<GameRound | undefined | CurrentGameRoundNumbers> {

    let currentGameRound = undefined;
    if (gameRoundParam > 0) {
      currentGameRound = this.viewPeriod.getGameRound(gameRoundParam);
    }
    if (currentGameRound !== undefined) {
      return of(currentGameRound);
    }
    return this.gameRoundRepository.getCurrentNumbers(this.pool.getCompetitionConfig(), this.viewPeriod);
  }

  // private convertObservable(observable: Observable<CurrentGameRoundNumbers>): Observable<GameRound | undefined> {

  //   let currentGameRound = undefined;
  //   if (gameRoundParam > 0) {
  //     currentGameRound = this.viewPeriod.getGameRound(gameRoundParam);
  //   }
  //   if (currentGameRound !== undefined) {
  //     return of(currentGameRound);
  //   }
  //   return this.gameRoundRepository.getCurrentNumbers(this.pool.getCompetitionConfig(), this.viewPeriod);
  // }


  private initGameRounds(gameRoundParam: number): void {

    this.getCurrentGameRound(gameRoundParam).subscribe({
      next: (object: GameRound | undefined | CurrentGameRoundNumbers) => {
        let currentGameRound;
        if (object instanceof GameRound) {
          currentGameRound = object;
        } else if (object !== undefined && object.hasOwnProperty('firstCreatedOrInProgress')) {
          const firstCreatedOrInProgress = object.firstCreatedOrInProgress;
          if (typeof firstCreatedOrInProgress === 'number') {
            currentGameRound = this.viewPeriod.getGameRound(firstCreatedOrInProgress);
          }
        }
        this.currentGameRound = currentGameRound;

        this.gameRounds = this.viewPeriod.getGameRounds().slice();
        if (currentGameRound !== undefined) {
          const idx = this.gameRounds.indexOf(this.currentGameRound);
          if (idx >= 0) {
            this.gameRounds = this.gameRounds.splice(idx).concat(this.gameRounds);
          }
        }
        this.updateGameRound(currentGameRound);
      },
      error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
      complete: () => this.processing = false
    });
  }

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }

  updateGameRound(currentGameRound: GameRound | undefined): void {
    this.processingGames = true;
    if (currentGameRound === undefined) {
      this.processingGames = false;
      return;
    }

    if (currentGameRound.hasAgainstGames()) {
      //  this.currentGame = (new GamePicker(this.pool.getSourceCompetition(), currentGameRound)).getGame(this.s11Player);
      this.processingGames = false;
      return;
    }
    this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
      next: (structure: Structure) => {
        this.sourceStructure = structure;
        const sourcePoule = structure.getSingleCategory().getRootRound().getFirstPoule();

        this.gameRepository.getSourceObjects(sourcePoule, currentGameRound).subscribe({
          next: (againstGames: AgainstGame[]) => {
            this.againstGames = againstGames;;
          },
          complete: () => this.processingGames = false
        });
      }
    });
  }

  getSourceStructure(competition: Competition): Observable<Structure> {
    if (this.sourceStructure !== undefined) {
      return of(this.sourceStructure);
    }
    return this.structureRepository.getObject(competition);
  }

  getCurrentGameRoundLabel(): string {
    if (this.currentGameRound === undefined) {
      return 'alle speelronden';
    }
    return 'speelronde ' + this.currentGameRound.getNumber();
  }

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
