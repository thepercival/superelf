import { Component, Input, OnInit } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ImageRepository } from '../../lib/image/repository';
import { PlayerTotalsCalculator } from '../../lib/player/totals/calculator';
import { JsonPlayerTotals } from '../../lib/player/totals/json';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { S11PlayerStatisticsComponent } from './base.component';

@Component({
  selector: 'app-s11player-viewperiod-statistics',
  templateUrl: './viewperiod.component.html',
  styleUrls: ['./viewperiod.component.scss']
})
export class S11PlayerViewPeriodStatisticsComponent extends S11PlayerStatisticsComponent implements OnInit {
  @Input() totals!: JsonPlayerTotals;
  @Input() line!: FootballLine;
  @Input() competitionConfig!: CompetitionConfig;

  public totalsCalculator: PlayerTotalsCalculator;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
    super(imageRepository, cssService);
    this.totalsCalculator = new PlayerTotalsCalculator(this.competitionConfig);
  }

  ngOnInit() {
    const sheetLines = (this.line && FootballLine.GoalKeeper) & (this.line && FootballLine.Defense);
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
