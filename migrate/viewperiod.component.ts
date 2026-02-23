import { Component, OnInit, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../src/app/lib/achievement/badge/category';
import { ImageRepository } from '../src/app/lib/image/repository';
import { ScorePointsMap } from '../src/app/lib/score/points';
import { Totals } from '../src/app/lib/totals';
import { CSSService } from '../src/app/shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from '../src/app/poolmodule/player/statistics/gameround.component';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  standalone: true,
  imports: [],
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
      const footballLine = this.line();
      const sheetLines: number =
        (footballLine & FootballLine.GoalKeeper) +
        (footballLine & FootballLine.Defense);
      this.sheetActive = sheetLines > 0;

      const sheetPoints =
        sheetLines > 0
          ? this.totals().getPoints(
              footballLine,
              this.scorePointsMap(),
              BadgeCategory.Sheet
            )
          : 0;
      this.categoryPoints = {
        result: this.totals().getPoints(
          footballLine,
          this.scorePointsMap(),
          BadgeCategory.Result
        ),
        goal:
          this.totals().getPoints(
            footballLine,
            this.scorePointsMap(),
            BadgeCategory.Goal
          ) +
          this.totals().getPoints(
            footballLine,
            this.scorePointsMap(),
            BadgeCategory.Assist
          ),
        sheet: sheetPoints,
        card: this.totals().getPoints(
          footballLine,
          this.scorePointsMap(),
          BadgeCategory.Card
        ),
      };    
  }

  ngOnInit() {
    
    this.processing.set(false);
  }
}
