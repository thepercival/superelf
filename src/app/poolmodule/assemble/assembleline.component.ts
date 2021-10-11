import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'ngx-sport';

import { SuperElfNameService } from '../../lib/nameservice';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';

@Component({
  selector: 'app-pool-assembleline',
  templateUrl: './assembleline.component.html',
  styleUrls: ['./assembleline.component.scss']
})
export class AssembleLineComponent implements OnInit {
  @Input() assembleLine!: AssembleLine;
  @Input() selectedPlace: AssembleLinePlace | undefined;
  @Input() processing: boolean = true;
  @Output() selectPlace = new EventEmitter<AssembleLinePlace>();
  @Output() hideOnSMDown = new EventEmitter<boolean>();

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  superElfNameService = new SuperElfNameService();

  constructor(
  ) {

  }

  ngOnInit() {
    this.processing = false;
  }

  select(place: AssembleLinePlace, smDown: boolean) {
    this.selectPlace.emit(place);
    this.hideOnSMDown.emit(smDown);
  }

  completed() {
    return this.assembleLine.places.every(place => place.player);
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

export interface AssembleLine {
  number: number;
  places: AssembleLinePlace[];
  substitute: AssembleLinePlace;
}

export interface AssembleLinePlace {
  lineNumber: number;
  number: number;
  player: S11Player | undefined;
  substitute: boolean;
}