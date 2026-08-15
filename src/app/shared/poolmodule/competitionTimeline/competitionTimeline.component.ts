import { Component, input } from '@angular/core';

import { CompetitionConfig } from '../../../lib/competitionConfig';

@Component({
  selector: 'app-competition-timeline',
  standalone: true,
  templateUrl: './competitionTimeline.component.html'
})
export class CompetitionTimelineComponent {
  readonly competitionConfig = input.required<CompetitionConfig>();

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}