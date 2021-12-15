import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, FootballLine, Person, Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { PlayerTotalsCalculator } from '../../lib/player/totals/calculator';
import { JsonPlayerTotals } from '../../lib/player/totals/json';
import { Points } from '../../lib/points';
import { PointsCalculator } from '../../lib/points/calculator';
import { Statistics } from '../../lib/statistics';
import { Totals } from '../../lib/totals';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent implements OnInit {
  @Input() s11Player!: S11Player;
  @Input() points!: Points;
  // @Input() team: Team | undefined;
  public processing = true;

  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;
  public totals!: JsonPlayerTotals;
  public totalsCalculator!: PlayerTotalsCalculator;
  public line!: FootballLine;
  public sheetActive!: boolean;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
  }

  ngOnInit() {
    this.totals = this.s11Player.getTotals();
    this.totalsCalculator = new PlayerTotalsCalculator();
    this.line = this.s11Player.getLine();
    this.sheetActive = this.line === FootballLine.GoalKepeer || this.line === FootballLine.Defense;

    // if (this.team) {
    //   this.teamName = this.team?.getName();
    //   this.teamImageUrl = this.team.getImageUrl();
    // }
    // this.personImageUrl = this.person?.getImageUrl();
    // this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());

    // this.updateCurrentGame();

    this.processing = false;
  }

  // updateCurrentGame() {
  //   if (this.currentGameRound === undefined) {
  //     this.currentGame = undefined;
  //     return;
  //   }
  //   this.currentGame = undefined; // this.currentGameRound.getNumber(), s11Player,
  // }

  // getTeamImageUrl(player: Player): string {
  //   return this.imageRepository.getTeamUrl(player.getTeam());
  // }

  // getPlayerImageUrl(player: Player): string {
  //   return this.imageRepository.getPlayerUrl(player);
  // }

  // previousGameRound(): void {
  //   this.currentGame
  //   this.currentGameRound
  // }

  // nextGameRound(): void {
  //   this.currentGame
  //   this.currentGameRound
  // }

  // getGame(): AgainstGame | undefined {
  //   // wt is bekend

  //   1 this.currentGameRound.getAgainstGames ?
  //     2 this.s11Player.getPerson().getPlayer()
  //   //
  // }
}
