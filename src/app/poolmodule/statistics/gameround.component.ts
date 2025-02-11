import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { GameRound } from '../../lib/gameRound';
import { ImageRepository } from '../../lib/image/repository';
import { FootballCard, FootballGoal } from '../../lib/score';
import { ScorePointsMap } from '../../lib/score/points';
import { Statistics } from '../../lib/statistics';

import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-s11player-gameround-statistics',
  standalone: true,
  imports: [SuperElfIconComponent,FontAwesomeModule],
  templateUrl: './gameround.component.html',
  styleUrls: ['./gameround.component.scss']
})
export class S11PlayerGameRoundStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit, OnChanges {
  readonly statistics = input.required<Statistics>();
  readonly line = input.required<FootballLine>();
  readonly gameRound = input.required<GameRound>();
  readonly scorePointsMap = input.required<ScorePointsMap>();
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
    // console.log('init pointsCaLCulator', this.pointsCalculator);
    const line = this.line();
    this.sheetActive = line === FootballLine.GoalKeeper || line === FootballLine.Defense;
    this.processing = false;
  }

  get YellowCard(): FootballCard { return FootballCard.Yellow; }
  get RedCard(): FootballCard { return FootballCard.Red; }
  get Goal(): FootballGoal { return FootballGoal.Normal; }
  get OwnGoal(): FootballGoal { return FootballGoal.Own; }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.statistics.currentValue !== changes.statistics.previousValue
      && changes.statistics.currentValue !== undefined) {
      const statistics: Statistics = changes.statistics.currentValue;
      
      // console.log('first changes statistics', changes.statistics.currentValue);
      const sheetLines = (this.line() & FootballLine.GoalKeeper) + (this.line() & FootballLine.Defense);
      const sheetPoints = sheetLines > 0 ? statistics.getPoints(this.line(), this.scorePointsMap(), BadgeCategory.Sheet ) : 0
      this.categoryPoints = {
        result: statistics.getPoints(this.line(), this.scorePointsMap(), BadgeCategory.Result),
        goal: statistics.getPoints(this.line(), this.scorePointsMap(), BadgeCategory.Goal)
            + statistics.getPoints(this.line(), this.scorePointsMap(), BadgeCategory.Assist),
        sheet: sheetPoints,
        card: statistics.getPoints(this.line(), this.scorePointsMap(), BadgeCategory.Card),
      }
    }
  }
}

