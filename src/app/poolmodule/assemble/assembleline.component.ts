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
  @Output() selectPlace = new EventEmitter<AssembleLinePlace>();

  superElfNameService = new SuperElfNameService();

  constructor(
  ) {

  }

  ngOnInit() {

  }

  select(place: AssembleLinePlace) {
    this.selectPlace.emit(place);
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