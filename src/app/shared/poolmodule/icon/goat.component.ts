import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superelf-goat-icon',
  standalone: true,
  template: `
    @if (userId() === goatUserId()) {
      <button type="button" class="btn btn-link p-0 border-0 ms-1 align-baseline" aria-label="Bekijk GOAT-prijzenkast" title="GOAT"
        (click)="openGoatAchievements($event)">
        <img class="align-text-bottom" height="20" src="assets/images/goat-small.png" alt="" />
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperElfGoatIconComponent {
  readonly userId = input.required<number>();
  readonly goatUserId = input<number | null>(null);
  readonly poolId = input.required<number>();

  constructor(private readonly router: Router) {}

  openGoatAchievements(event: MouseEvent): void {
    event.stopPropagation();
    void this.router.navigate(['/pool/achievements', this.poolId()], {
      queryParams: { goat: 1 },
    });
  }
}