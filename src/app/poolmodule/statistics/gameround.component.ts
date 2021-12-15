import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, Person, Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { Points } from '../../lib/points';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-s11player-gameround-statistics',
  templateUrl: './gameround.component.html',
  styleUrls: ['./gameround.component.scss']
})
export class S11PlayerGameRoundStatisticsComponent implements OnInit {
  @Input() s11Player!: S11Player;
  @Input() points!: Points;
  @Input() gameRound!: GameRound;
  public processing = true;

  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
  }

  ngOnInit() {
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
