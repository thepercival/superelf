import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, Competition, Player, StartLocationMap, Structure } from 'ngx-sport';
import { concatMap, map, Observable, of } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { GamePicker } from '../../lib/gameRound/gamePicker';
import { GameRoundRepository } from '../../lib/gameRound/repository';
import { ImageRepository } from '../../lib/image/repository';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { ViewPeriod } from '../../lib/period/view';
import { S11Player, StatisticsMap } from '../../lib/player';
import { S11PlayerRepository } from '../../lib/player/repository';
import { PointsCalculator } from '../../lib/points/calculator';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { Statistics } from '../../lib/statistics';
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
  public againstGames: AgainstGame[] = [];

  // @Input() team: Team | undefined;
  public processing = true;
  public processingGames = false;

  //  public currentStatistics: Statistics | undefined;
  //  public currentPoints: number | undefined;
  public sourceStructure: Structure | undefined;
  public startLocationMap!: StartLocationMap;

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  private sliderGameRounds: (GameRound | undefined)[] = [];

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
        this.initSliderGameRounds();
        this.route.params.subscribe(params => {
          // const gameRoundNumber = +params.gameRound;
          // if (gameRoundNumber > 0) {
          //   this.currentGameRound = currentViewPeriod.getGameRound(gameRoundNumber)
          // }
          this.gameRoundRepository.getFirstObjectNotFinished(
            competitionConfig,
            currentViewPeriod
          ).subscribe({
            next: (gameRound: GameRound | undefined) => {
              this.currentGameRound = gameRound;
              this.updateGameRound();
            },
            error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
            complete: () => this.processing = false
          });
        });
      },
      error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
    })
  }

  private initSliderGameRounds(): void {
    this.sliderGameRounds = this.viewPeriod.getGameRounds().slice();
    if (this.currentGameRound !== undefined) {
      const idx = this.sliderGameRounds.indexOf(this.currentGameRound);
      if (idx >= 0) {
        this.sliderGameRounds = this.sliderGameRounds.splice(idx).concat(this.sliderGameRounds);
      }
    }
  }

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }

  updateGameRound(): void {
    const gameRound = this.currentGameRound;
    if (gameRound === undefined) {
      //this.currentStatistics = undefined;
      return;
    }
    // this.currentStatistics = this.s11Player.getGameStatistics(currentGameRound.getNumber());

    if (gameRound.hasAgainstGames()) {
      //  this.currentGame = (new GamePicker(this.pool.getSourceCompetition(), currentGameRound)).getGame(this.s11Player);
      return;
    }
    this.processingGames = true;
    this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
      next: (structure: Structure) => {
        this.sourceStructure = structure;
        const sourcePoule = structure.getSingleCategory().getRootRound().getFirstPoule();

        this.gameRepository.getSourceObjects(sourcePoule, gameRound).subscribe({
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

  previousGameRound(): void {
    this.currentGameRound = this.sliderGameRounds.pop();
    this.sliderGameRounds.unshift(this.currentGameRound);
    this.updateGameRound();
  }

  nextGameRound(): void {
    this.sliderGameRounds.push(this.sliderGameRounds.shift());
    this.currentGameRound = this.sliderGameRounds.shift();
    this.sliderGameRounds.unshift(this.currentGameRound);
    this.updateGameRound();
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
