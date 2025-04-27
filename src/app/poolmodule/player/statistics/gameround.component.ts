import { Component, OnChanges, OnInit, SimpleChanges, WritableSignal, input, signal } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../../../lib/achievement/badge/category';
import { ImageRepository } from '../../../lib/image/repository';
import { FootballCard, FootballGoal } from '../../../lib/score';
import { ScorePointsMap } from '../../../lib/score/points';
import { Statistics } from '../../../lib/statistics';

import { CSSService } from '../../../shared/commonmodule/cssservice';
import { SuperElfIconComponent } from '../../../shared/poolmodule/icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { facCard, facCleanSheet, facPenalty, facSpottySheet } from '../../../shared/poolmodule/icons';
import { faCheckCircle, faFutbol, faHandshakeAngle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "s11-player-statistics",
  standalone: true,
  imports: [NgIf,SuperElfIconComponent, FontAwesomeModule],
  templateUrl: "./gameround.component.html",
  styleUrls: ["./gameround.component.scss"],
})
export class S11PlayerStatisticsComponent
  implements OnInit, OnChanges
{
  public readonly statistics = input.required<Statistics>();
  public readonly line = input.required<FootballLine>();
  public readonly scorePointsMap = input.required<ScorePointsMap>();

  public processing: WritableSignal<boolean> = signal(true);
  public sheetActive!: boolean;
  public categoryPoints: CategoryPoints | undefined;

  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;
  public facCleanSheet = facCleanSheet;
  public facSpottySheet = facSpottySheet;
  public facPenalty = facPenalty;
  public facCard = facCard;
  public faFutbol = faFutbol;
  public faCheckCircle = faCheckCircle;
  public faHandshakeAngle = faHandshakeAngle;

  constructor
    (public imageRepository: ImageRepository, 
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

      // console.log('first changes statistics', changes.statistics.currentValue);
      const sheetLines =
        (this.line() & FootballLine.GoalKeeper) +
        (this.line() & FootballLine.Defense);
      const sheetPoints =
        sheetLines > 0
          ? statistics.getPoints(
              this.line(),
              this.scorePointsMap(),
              BadgeCategory.Sheet
            )
          : 0;
      this.categoryPoints = {
        result: statistics.getPoints(
          this.line(),
          this.scorePointsMap(),
          BadgeCategory.Result
        ),
        goal:
          statistics.getPoints(
            this.line(),
            this.scorePointsMap(),
            BadgeCategory.Goal
          ) +
          statistics.getPoints(
            this.line(),
            this.scorePointsMap(),
            BadgeCategory.Assist
          ),
        goalHasStats: this.hasStatisticsGoalStats(statistics),
        sheet: sheetPoints,
        sheetHasStats: this.hasStatisticsSheetStats(statistics),
        card: statistics.getPoints(
          this.line(),
          this.scorePointsMap(),
          BadgeCategory.Card
        ),
        cardHasStats: this.hasStatisticsCardStats(statistics),
      };
    }
  }

  private hasStatisticsGoalStats(statistics: Statistics): boolean {
    return statistics.getNrOfFieldGoals() > 0 ||
      statistics.getNrOfAssists() > 0 ||
      statistics.getNrOfPenalties() > 0 ||
      statistics.getNrOfOwnGoals() > 0;
  }

  private hasStatisticsSheetStats(statistics: Statistics): boolean {
    return statistics.hasCleanSheet() === true || statistics.hasSpottySheet() === true;
  }

  private hasStatisticsCardStats(statistics: Statistics): boolean {
    return statistics.getNrOfYellowCards() > 0 || statistics.gotDirectRedCard();
  }

    getBackgroundClass(points: number): string {
        return points < 0 ? 'bg-negative' : points > 0 ? 'bg-positive' : 'bg-zero';
    }

    getBorderClass(points: number): string {
        return points < 0 ? 'border-danger' : points > 0 ? 'border-success' : 'border-zero';
    }
}

interface CategoryPoints {
    result: number,
    goal: number,
    goalHasStats: boolean,
    card: number,
    cardHasStats: boolean,
    sheet: number,
    sheetHasStats: boolean
}