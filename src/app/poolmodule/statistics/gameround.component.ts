import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgainstGame, FootballLine, Person, Player } from 'ngx-sport';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { PointsCalculator } from '../../lib/points/calculator';
import { FootballCard, FootballGoal } from '../../lib/score';
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
  @Input() gameRound!: GameRound;
  @Input() competitionConfig!: CompetitionConfig;
  public pointsCalculator!: PointsCalculator;
  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;

  constructor(
    imageRepository: ImageRepository,
    cssService: CSSService) {
    super(imageRepository, cssService);
  }

  ngOnInit() {
    // if (this.team) {
    //   this.teamName = this.team?.getName();
    //   this.teamImageUrl = this.team.getImageUrl();
    // }
    // this.personImageUrl = this.person?.getImageUrl();
    // this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.s11Player.getPerson());

    // this.updateCurrentGame();    
    if (this.pointsCalculator === undefined) {
      this.pointsCalculator = new PointsCalculator(this.competitionConfig);
    }
    // console.log('init pointsCaLCulator', this.pointsCalculator);
    this.sheetActive = this.line === FootballLine.GoalKeeper || this.line === FootballLine.Defense;
    this.processing = false;
  }

  get YellowCard(): FootballCard { return FootballCard.Yellow; }
  get RedCard(): FootballCard { return FootballCard.Red; }
  get Goal(): FootballGoal { return FootballGoal.Normal; }
  get OwnGoal(): FootballGoal { return FootballGoal.Own; }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.statistics.currentValue !== changes.statistics.previousValue
      && changes.statistics.currentValue !== undefined) {
      if (this.pointsCalculator === undefined) {
        this.pointsCalculator = new PointsCalculator(this.competitionConfig);
      }
      // console.log(changes.statistics.currentValue, changes.statistics.currentValue.getSpottySheet23());

      // console.log('first changes statistics', changes.statistics.currentValue);
      const sheetLines = (this.line & FootballLine.GoalKeeper) + (this.line & FootballLine.Defense);
      const sheetPoints = sheetLines > 0 ? this.pointsCalculator.getSheetPoints(this.line, changes.statistics.currentValue) : 0
      this.categoryPoints = {
        result: this.pointsCalculator.getResultPoints(changes.statistics.currentValue),
        goal: this.pointsCalculator.getGoalPoints(this.line, changes.statistics.currentValue),
        sheet: sheetPoints,
        card: this.pointsCalculator.getCardPoints(changes.statistics.currentValue),
      }
    }
  }
}

