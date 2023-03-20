import { Component, Input, OnInit } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { BadgeCategory } from '../../lib/achievement/badge/category';
import { ImageRepository } from '../../lib/image/repository';
import { LineScorePointsMap } from '../../lib/score/points';
import { Totals } from '../../lib/totals';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit {
  @Input() totals!: Totals;
  @Input() line!: FootballLine;
  @Input() lineScorePointsMap!: LineScorePointsMap;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
    super(imageRepository, cssService);
  }

  ngOnInit() {
    const sheetLines: number = (this.line & FootballLine.GoalKeeper) + (this.line & FootballLine.Defense);
    this.sheetActive = sheetLines > 0;

    const sheetPoints = sheetLines > 0 ? this.totals.getPoints(this.line, this.lineScorePointsMap, BadgeCategory.Sheet) : 0
    this.categoryPoints = {
      result: this.totals.getPoints(this.line, this.lineScorePointsMap, BadgeCategory.Result),
      goal: this.totals.getPoints(this.line, this.lineScorePointsMap, BadgeCategory.Goal) 
        + this.totals.getPoints(this.line, this.lineScorePointsMap, BadgeCategory.Assist),
      sheet: sheetPoints,
      card: this.totals.getPoints(this.line, this.lineScorePointsMap, BadgeCategory.Card),
    }
    this.processing = false;
  }
}
