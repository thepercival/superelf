import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, Team } from 'ngx-sport';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { CSSService } from '../../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-pool-assembleline',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class FormationLineAssembleComponent implements OnInit {
  @Input() line!: S11FormationLine;
  @Input() selectedPlace: S11FormationPlace | undefined;
  @Input() processing: boolean = true;
  @Output() editPlace = new EventEmitter<S11FormationPlace>();
  @Output() linkToPlayer = new EventEmitter<S11Player>();

  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    public imageRepository: ImageRepository,
    public superElfNameService: SuperElfNameService,
    private formationRepository: FormationRepository,
    private modalService: NgbModal,
    private cssService: CSSService
  ) {

  }

  ngOnInit() {
    this.processing = false;
  }

  completed() {
    return this.line.getPlaces().every((place: S11FormationPlace) => place.getPlayer());
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

  emptyPlace(place: S11FormationPlace) {
    this.processing = true;
    this.formationRepository.editPlace(place, undefined).subscribe({
      next: () => { },
      complete: () => this.processing = false
    });
  }

  // getBorderClass(): string {
  //   return 'border-line-' + this.line.getNumber();
  // }

  // getBGColorClass(): string {
  //   return 'bg-color-line-' + this.line.getNumber();
  // }

  getLineClass(prefix: string): string {
    return this.cssService.getLine2(this.line.getNumber(), prefix + '-');
  }

  maybeLinkToPlayer(place: S11FormationPlace): void {
    const s11Player = place.getPlayer();
    if (s11Player === undefined) {
      return;
    }
    this.linkToPlayer.emit(s11Player);
  }
}
