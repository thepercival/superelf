import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, Team } from 'ngx-sport';
import { S11FormationLine } from '../../lib/formation/line';
import { S11FormationPlace } from '../../lib/formation/place';

import { SuperElfNameService } from '../../lib/nameservice';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { CSSService } from '../../shared/commonmodule/cssservice';

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
    public imageRepository: ImageRepository,
    public superElfNameService: SuperElfNameService,
    private modalService: NgbModal,
    private cssService: CSSService
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
      return '';
    }
    const abbreviation = player.getTeam().getAbbreviation();
    return abbreviation ? abbreviation : '';
  }

  getTeamImageUrl(person: Person): string {
    const team = this.getCurrentTeam(person);
    return team ? this.imageRepository.getTeamUrl(team) : '';
  }

  getCurrentTeam(person: Person | undefined): Team | undefined {
    if (!person) {
      return undefined;
    }
    const player = this.oneTeamSimultaneous.getCurrentPlayer(person);
    if (!player) {
      return undefined;
    }
    return player.getTeam();
  }

  // getBorderClass(): string {
  //   return 'border-line-' + this.line.getNumber();
  // }

  // getBGColorClass(): string {
  //   return 'bg-color-line-' + this.line.getNumber();
  // }

  getLineClass(): string {
    return 'bg-color-line-' + this.cssService.getLine(this.line.getNumber()) + ' text-white';
  }

  showPlayer(s11Player: S11Player | undefined): void {
    if (!s11Player) {
      return;
    }
    // const modalRef = this.modalService.open(S11PlayerInfoModalComponent);
    // modalRef.componentInstance.s11Player = s11Player;
    // // modalRef.componentInstance.name = poolUser.getName();
    // modalRef.result.then((result) => {
    //   // this.remove(poolUser);
    // }, (reason) => {
    // });
  }
}
