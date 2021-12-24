import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { AgainstGame, Competition, CompetitorMap, Player, State, Structure } from 'ngx-sport';
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
import { Statistics } from '../../lib/statistics';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { MyNavigation } from '../../shared/commonmodule/navigation';

@Component({
  selector: 'app-s11player-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class S11PlayerComponent implements OnInit {
  public s11Player!: S11Player;
  public pool!: Pool;
  public currentGameRound: GameRound | undefined;

  // @Input() team: Team | undefined;
  public processing = true;
  public processingGames = false;
  public currentGame: AgainstGame | undefined;
  public currentStatistics: Statistics | undefined;
  public currentPoints: number | undefined;
  public sourceStructure: Structure | undefined;
  public competitorMap!: CompetitorMap;

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public player: Player | undefined;
  private sliderGameRounds: (GameRound | undefined)[] = [];
  private pointsCalculator: PointsCalculator;

  constructor(
    private statisticsRepository: StatisticsRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation,
    private route: ActivatedRoute,
    private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    if (state !== undefined) {
      this.s11Player = state.s11Player;
      this.pool = state.pool;
      this.currentGameRound = state.currentGameRound ?? undefined;
    }
    this.pointsCalculator = new PointsCalculator();
  }

  ngOnInit() {
    if (this.s11Player === undefined) {
      this.route.params.subscribe(params => {
        this.router.navigate(['/pool', +params['id']]);
      });
      return
    }

    this.competitorMap = new CompetitorMap(this.pool.getSourceCompetition().getTeamCompetitors());

    this.initSliderGameRounds();

    this.updateGameRound();

    if (!this.s11Player.hasStatistics()) {
      this.statisticsRepository.getObjects(this.s11Player).subscribe({
        next: (statistics: StatisticsMap) => {
          this.s11Player.setStatistics(statistics);
        },
        complete: () => this.processing = false
      });
    } else {
      this.processing = false;
    }
  }

  private initSliderGameRounds(): void {
    this.sliderGameRounds = this.s11Player.getViewPeriod().getGameRounds().slice();
    this.sliderGameRounds.unshift(undefined);
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
    const currentGameRound = this.currentGameRound;
    if (currentGameRound === undefined) {
      this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());
      this.currentStatistics = undefined;
      this.currentGame = undefined;
      return;
    }
    this.currentStatistics = this.s11Player.getGameStatistics(currentGameRound.getNumber());

    if (currentGameRound.hasAgainstGames()) {
      this.currentGame = (new GamePicker(currentGameRound)).getGame(this.s11Player.getPerson());
      return;
    }
    this.processingGames = true;
    this.getSourceStructure(this.pool.getSourceCompetition()).subscribe({
      next: (structure: Structure) => {
        this.sourceStructure = structure;
        const sourcePoule = structure.getRootRound().getFirstPoule();

        this.gameRepository.getSourceObjects(sourcePoule, currentGameRound).subscribe({
          next: (againstGames: AgainstGame[]) => {
            this.currentGame = (new GamePicker(currentGameRound)).getGame(this.s11Player.getPerson());
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

  getCurrentGameRoundPoints(): number {
    if (this.currentGameRound === undefined) {
      return this.s11Player.getTotalPoints();
    }
    if (this.currentStatistics === undefined) {
      return 0;
    }
    return this.pointsCalculator.getPoints(this.s11Player.getLine(), this.currentStatistics, this.pool.getPoints());
  }

  navigateBack() {
    this.myNavigation.back();
  }
}