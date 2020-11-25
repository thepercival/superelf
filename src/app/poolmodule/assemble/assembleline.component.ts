import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Person, Player } from 'ngx-sport';
import { SuperElfNameService } from '../../lib/nameservice';

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
    return this.assembleLine.substitute?.player && this.assembleLine.places.every(place => place.player);
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
  player: Player | undefined;
  isSubstitute: boolean;
}