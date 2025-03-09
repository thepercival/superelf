import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../../../lib/achievement/badge/category';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { FootballCard, FootballGoal } from '../../../lib/score';
import { ScorePointsMap } from '../../../lib/score/points';
import { Statistics } from '../../../lib/statistics';

import { CSSService } from '../../../shared/commonmodule/cssservice';
import { SuperElfIconComponent } from '../../../shared/poolmodule/icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { facCard, facCleanSheet, facPenalty, facSpottySheet } from '../../../shared/poolmodule/icons';
import { faCheckCircle, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { S11PlayerStatisticsBaseComponent } from './base.component';
import { CompetitionConfig } from '../../../lib/competitionConfig';

@Component({
  selector: "s11-player-statistics",
  standalone: true,
  imports: [NgIf, SuperElfIconComponent, FontAwesomeModule],
  templateUrl: "./gameround.component.html",
  styleUrls: ["./gameround.component.scss"],
})
export class S11PlayerStatisticsComponent
  extends S11PlayerStatisticsBaseComponent
  implements OnInit, OnChanges
{
  public readonly statistics = input.required<Statistics>();
  public readonly line = input.required<FootballLine>();
  public readonly gameRound = input.required<GameRound>();
  public readonly competitionConfig = input.required<CompetitionConfig>();
  
  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;
  public facCleanSheet = facCleanSheet;
  public facSpottySheet = facSpottySheet;
  public facPenalty = facPenalty;
  public facCard = facCard;
  public faFutbol = faFutbol;
  public faCheckCircle = faCheckCircle;

  constructor(imageRepository: ImageRepository, cssService: CSSService) {
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
    this.sheetActive =
      line === FootballLine.GoalKeeper || line === FootballLine.Defense;
    this.processing.set(false);
  }

  get YellowCard(): FootballCard {
    return FootballCard.Yellow;
  }
  get RedCard(): FootballCard {
    return FootballCard.Red;
  }
  get Goal(): FootballGoal {
    return FootballGoal.Normal;
  }
  get OwnGoal(): FootballGoal {
    return FootballGoal.Own;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.statistics.currentValue !== changes.statistics.previousValue &&
      changes.statistics.currentValue !== undefined
    ) {
      const statistics: Statistics = changes.statistics.currentValue;
      const scorePointsMap = this.competitionConfig().getScorePointsMap();

      // console.log('first changes statistics', changes.statistics.currentValue);
      const sheetLines =
        (this.line() & FootballLine.GoalKeeper) +
        (this.line() & FootballLine.Defense);
      const sheetPoints =
        sheetLines > 0
          ? statistics.getPoints(
              this.line(),
              scorePointsMap,
              BadgeCategory.Sheet
            )
          : 0;
      this.categoryPoints = {
        result: statistics.getPoints(
          this.line(),
          scorePointsMap,
          BadgeCategory.Result
        ),
        goal:
          statistics.getPoints(
            this.line(),
            scorePointsMap,
            BadgeCategory.Goal
          ) +
          statistics.getPoints(
            this.line(),
            scorePointsMap,
            BadgeCategory.Assist
          ),
        sheet: sheetPoints,
        card: statistics.getPoints(
          this.line(),
          scorePointsMap,
          BadgeCategory.Card
        ),
      };
    }
  }
}

