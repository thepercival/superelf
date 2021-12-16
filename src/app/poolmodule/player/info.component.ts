import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, Person, Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player, StatisticsMap } from '../../lib/player';
import { Points } from '../../lib/points';
import { PointsCalculator } from '../../lib/points/calculator';
import { Statistics } from '../../lib/statistics';
import { StatisticsRepository } from '../../lib/statistics/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-s11player-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class S11PlayerComponent implements OnInit {
  @Input() s11Player!: S11Player;
  @Input() points!: Points;
  @Input() currentGameRound: GameRound | undefined;
  // @Input() team: Team | undefined;
  public processing = true;
  public processingGames = false;
  public currentGame: AgainstGame | undefined;
  public currentStatistics: Statistics | undefined;
  // public teamImageUrl: string | undefined;
  // public teamName: string = '';
  // public personImageUrl: string | undefined;

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public player: Player | undefined;
  private sliderGameRounds: (GameRound | undefined)[] = [];
  private pointsCalculator: PointsCalculator;

  constructor(
    private statisticsRepository: StatisticsRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
    this.pointsCalculator = new PointsCalculator();
  }

  ngOnInit() {
    // if (this.team) {
    //   this.teamName = this.team?.getName();
    //   this.teamImageUrl = this.team.getImageUrl();
    // }
    // this.personImageUrl = this.person?.getImageUrl();

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

  // updateCurrentGame() {
  //   if (this.currentGameRound === undefined) {
  //     this.currentGame = undefined;
  //     return;
  //   }
  //   this.currentGame = undefined; // this.currentGameRound.getNumber(), s11Player, 
  // }

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }

  updateGameRound(): void {
    if (this.currentGameRound === undefined) {
      this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());
      this.currentStatistics = undefined;
      this.currentGame = undefined;
    } else {
      this.currentStatistics = this.s11Player.getGameStatistics(this.currentGameRound.getNumber());

      // laad alleen de game-title!!!
      this.processingGames = true;
      if (this.currentGameRound.)
        this.statisticsRepository.getObjects(this.s11Player).subscribe({
          next: (againstGames: AgainstGame[]) => {

          },
          complete: () => this.processingGames = false
        });
      // obv gameRoundNumber zou je moeten kunnen bepalen welke speler je moet hebben.
      //  de periode van de gameroundnummer kun je uit de wedstrijden halen
      // this.currentGame = undefined;
      // this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());
    }
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
    return this.pointsCalculator.getPoints(this.s11Player.getLine(), this.currentStatistics, this.points);
  }

  // getGame(): AgainstGame | undefined {
  //   // wt is bekend

  //   1 this.currentGameRound.getAgainstGames ?
  //     2 this.s11Player.getPerson().getPlayer()
  //   //
  // }
}
