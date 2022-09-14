import { Component, Input, OnInit } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ImageRepository } from '../../lib/image/repository';
import { TotalsCalculator } from '../../lib/totals/calculator';
import { JsonTotals } from '../../lib/totals/json';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit {
  @Input() totals!: JsonTotals;
  @Input() line!: FootballLine;
  @Input() competitionConfig!: CompetitionConfig;

  public totalsCalculator!: TotalsCalculator;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
    super(imageRepository, cssService);
  }

  ngOnInit() {
    this.totalsCalculator = new TotalsCalculator(this.competitionConfig);
    const sheetLines: number = (this.line & FootballLine.GoalKeeper) + (this.line & FootballLine.Defense);
    this.sheetActive = sheetLines > 0;

    const sheetPoints = sheetLines > 0 ? this.totalsCalculator.getSheetPoints(sheetLines, this.totals) : 0
    this.categoryPoints = {
      result: this.totalsCalculator.getResultPoints(this.totals),
      goal: this.totalsCalculator.getGoalPoints(this.line, this.totals),
      sheet: sheetPoints,
      card: this.totalsCalculator.getCardPoints(this.totals),
    }
    this.processing = false;
  }
}
