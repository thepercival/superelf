import { Component, Input, OnInit } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';
import { PlayerTotalsCalculator } from '../../lib/player/totals/calculator';
import { JsonPlayerTotals } from '../../lib/player/totals/json';
import { Points } from '../../lib/points';
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
  @Input() points!: Points;

  public totalsCalculator: PlayerTotalsCalculator;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
    super(imageRepository, cssService);
    this.totalsCalculator = new PlayerTotalsCalculator();
  }

  ngOnInit() {
    this.sheetActive = this.line === FootballLine.GoalKepeer || this.line === FootballLine.Defense;

    this.categoryPoints = {
      result: this.totalsCalculator.getResultPoints(this.totals, this.points),
      goal: this.totalsCalculator.getGoalPoints(this.line, this.totals, this.points),
      sheet: this.totalsCalculator.getSheetPoints(this.line, this.totals, this.points),
      card: this.totalsCalculator.getCardPoints(this.totals, this.points),
    }
    this.processing = false;
  }
}
