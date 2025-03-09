import { Component, OnInit, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../src/app/lib/achievement/badge/category';
import { ImageRepository } from '../src/app/lib/image/repository';
import { ScorePointsMap } from '../src/app/lib/score/points';
import { Totals } from '../src/app/lib/totals';
import { CSSService } from '../src/app/shared/commonmodule/cssservice';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  standalone: true,
  imports: [NgIf],
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent extends PlayerStatisticsComponent implements OnInit {
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
    
    this.processing.set(false);
  }
}
