import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'ngx-sport';
import { S11FormationLine } from '../../lib/formation/line';
import { S11FormationPlace } from '../../lib/formation/place';

import { SuperElfNameService } from '../../lib/nameservice';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';

@Component({
  selector: 'app-pool-assembleline',
  templateUrl: './assembleline.component.html',
  styleUrls: ['./assembleline.component.scss']
})
export class AssembleLineComponent implements OnInit {
  @Input() line!: S11FormationLine;
  @Input() selectedPlace: S11FormationPlace | undefined;
  @Input() processing: boolean = true;
  @Output() selectPlace = new EventEmitter<S11FormationPlace>();
  @Output() hideOnSMDown = new EventEmitter<boolean>();

  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    public superElfNameService: SuperElfNameService,
  ) {

  }

  ngOnInit() {
    this.processing = false;
  }

  select(place: S11FormationPlace, smDown: boolean) {
    this.selectPlace.emit(place);
    this.hideOnSMDown.emit(smDown);
  }

  completed() {
    return this.line.getPlaces().every((place: S11FormationPlace) => place.getPlayer());
  }

  getTeamAbbreviation(person: Person): string {
    const player = this.oneTeamSimultaneous.getCurrentPlayer(person);
    if (!player) {
      return '?';
    }
    const abbreviation = player.getTeam().getAbbreviation();
    return abbreviation ? abbreviation : '';
  }
}
