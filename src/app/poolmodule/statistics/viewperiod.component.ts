import { Component, OnInit, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { ImageRepository } from '../../lib/image/repository';
import { ScorePointsMap } from '../../lib/score/points';
import { Totals } from '../../lib/totals';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit {
  readonly totals = input.required<Totals>();
  readonly line = input.required<FootballLine>();
  readonly scorePointsMap = input.required<ScorePointsMap>();

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
      super(imageRepository, cssService);
      const sheetLines: number =
        (this.line() & FootballLine.GoalKeeper) +
        (this.line() & FootballLine.Defense);
      this.sheetActive = sheetLines > 0;

      const sheetPoints =
        sheetLines > 0
          ? this.totals().getPoints(
              this.line(),
              this.scorePointsMap(),
              BadgeCategory.Sheet
            )
          : 0;
      this.categoryPoints = {
        result: this.totals().getPoints(
          this.line(),
          this.scorePointsMap(),
          BadgeCategory.Result
        ),
        goal:
          this.totals().getPoints(
            this.line(),
            this.scorePointsMap(),
            BadgeCategory.Goal
          ) +
          this.totals().getPoints(
            this.line(),
            this.scorePointsMap(),
            BadgeCategory.Assist
          ),
        sheet: sheetPoints,
        card: this.totals().getPoints(
          this.line(),
          this.scorePointsMap(),
          BadgeCategory.Card
        ),
      };    
  }

  ngOnInit() {
    
    this.processing = false;
  }
}
