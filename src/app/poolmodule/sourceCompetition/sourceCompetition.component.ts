import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScoutedPlayerAddComponent } from '../scoutedPlayer/add.component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';

@Component({
  selector: 'app-pool-source-competition',
  standalone: true,
  imports: [ScoutedPlayerAddComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<app-pool-scouted-player-add pageTitle="Eredivisie" [navBarItem]="SourceCompetition"></app-pool-scouted-player-add>'
})
export class SourceCompetitionComponent {
  readonly SourceCompetition = NavBarItem.SourceCompetition;
}