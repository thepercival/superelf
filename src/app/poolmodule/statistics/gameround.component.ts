import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgainstGame, FootballLine, Person, Player } from 'ngx-sport';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { Points } from '../../lib/points';
import { PointsCalculator } from '../../lib/points/calculator';
import { Statistics } from '../../lib/statistics';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';

@Component({
  selector: 'app-s11player-gameround-statistics',
  templateUrl: './gameround.component.html',
  styleUrls: ['./gameround.component.scss']
})
export class S11PlayerGameRoundStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit, OnChanges {
  @Input() statistics!: Statistics | undefined;
  @Input() line!: FootballLine;
  @Input() points!: Points;
  @Input() gameRound!: GameRound;
  public pointsCalculator: PointsCalculator;
  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;

  constructor(
    imageRepository: ImageRepository,
    cssService: CSSService) {
    super(imageRepository, cssService);
    this.pointsCalculator = new PointsCalculator();
  }

  ngOnInit() {
    // if (this.team) {
    //   this.teamName = this.team?.getName();
    //   this.teamImageUrl = this.team.getImageUrl();
    // }
    // this.personImageUrl = this.person?.getImageUrl();
    // this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());

    // this.updateCurrentGame();    
    this.sheetActive = this.line === FootballLine.GoalKepeer || this.line === FootballLine.Defense;
    this.processing = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.statistics.currentValue !== changes.statistics.previousValue) {
      this.categoryPoints = {
        result: this.pointsCalculator.getResultPoints(changes.statistics.currentValue, this.points),
        goal: this.pointsCalculator.getGoalPoints(this.line, changes.statistics.currentValue, this.points),
        sheet: this.pointsCalculator.getSheetPoints(this.line, changes.statistics.currentValue, this.points),
        card: this.pointsCalculator.getCardPoints(changes.statistics.currentValue, this.points),
      }
    }
  }
}

