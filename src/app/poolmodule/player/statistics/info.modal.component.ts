import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Statistics } from '../../../lib/statistics';
import { JsonGameParticipationStatistic } from '../../../lib/statistics/json';

@Component({
  selector: 's11-player-statistics-info-modal',
  standalone: true,
  templateUrl: './info.modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class S11PlayerStatisticsInfoModalComponent {
  @Input({ required: true }) playerName!: string;
  @Input({ required: true }) statistics!: Statistics;

  constructor(public readonly modal: NgbActiveModal) {}

  formatStatisticName(name: string): string {
    const labels: Record<string, string> = {
      expectedGoals: 'xG',
      expectedGoalsOnTarget: 'xG on target',
      expectedAssists: 'xA',
      'ratingVersions.original': 'Rating (original)',
      'ratingVersions.alternative': 'Rating (alternative)',
    };
    return labels[name] ?? name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  formatStatisticValue(statistic: JsonGameParticipationStatistic): string {
    return new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 }).format(statistic.value);
  }
}