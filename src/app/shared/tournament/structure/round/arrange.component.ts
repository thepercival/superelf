import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Round, StructureService } from 'ngx-sport';

import { Tournament } from '../../../../lib/pool';

@Component({
  selector: 'app-tournament-structureround-arrange',
  templateUrl: './arrange.component.html',
  styleUrls: ['./arrange.component.css']
})
export class StructureRoundArrangeComponent {

  @Input() round: Round;
  @Output() arrangeAction = new EventEmitter<string>();

  constructor() {
  }

  addPoule() {
    this.arrangeAction.emit('addPoule');
  }

  removePoule() {
    this.arrangeAction.emit('removePoule');
  }

  addPlace() {
    if (this.round.isRoot()) {
      this.arrangeAction.emit('addPlace');
    }
  }

  removePlace() {
    this.arrangeAction.emit('removePlace');
  }

  canRemovePlace() {
    return !this.hasMinimumNrOfPlacesPerPoule();
  }

  hasMinimumNrOfPlacesPerPoule() {
    return (this.round.getPoules().length * 2) === this.round.getNrOfPlaces();
  }

  // getDivisionClasses(round: Round): string {
  //   const nrOfRounds = round.getNumber().getRounds().length;
  //   let classes = '';
  //   if (nrOfRounds > 2) {
  //     classes += 'more-than-two-rounds';
  //   }
  //   if (nrOfRounds > 4) {
  //     classes += ' more-than-four-rounds';
  //   }
  //   if (nrOfRounds > 8) {
  //     classes += ' more-than-eight-rounds';
  //   }
  //   return classes;
  // }
}
