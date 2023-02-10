import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Person, Team } from 'ngx-sport';
import { Substitution } from '../../../lib/editAction/substitution';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { GameRepository } from '../../../lib/ngx-sport/game/repository';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { CSSService } from '../../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-pool-formationline-substitutions',
  templateUrl: './substitutions.component.html',
  styleUrls: ['./substitutions.component.scss']
})
export class FormationLineSubstitutionsComponent implements OnInit {
  @Input() line!: S11FormationLine;
  @Input() selectedPlace: S11FormationPlace | undefined;
  @Input() viewGameRound: GameRound | undefined;
  @Input() processing: boolean = true;
  @Input() substitutions: Substitution[] = [];
  @Output() substitute = new EventEmitter<S11FormationPlace>();
  @Output() linkToPlayer = new EventEmitter<S11Player>();
  @Output() remove = new EventEmitter<Substitution[]>();

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

  getTeamImageUrl(s11Player: S11Player): string {
    const team = this.getCurrentTeam(s11Player);
    return team ? this.imageRepository.getTeamUrl(team) : '';
  }

  getCurrentTeam(s11Player: S11Player | undefined): Team | undefined {
    if (!s11Player) {
      return undefined;
    }
    const player = this.oneTeamSimultaneous.getCurrentPlayer(s11Player);
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
    return this.cssService.getLine(this.line.getNumber(), prefix + '-');
  }

  getPointsTotalsClass() {
    return this.viewGameRound === undefined ? 'bg-totals' : 'bg-points';
  }

  hasAppearances(place: S11FormationPlace): boolean {
    const viewGameRound = this.viewGameRound;
    if (viewGameRound === undefined) {
      return true;
    }
    return place.getPlayer()?.getGameStatistics(viewGameRound.getNumber())?.hasAppeared() === true;
  }

  maybeLinkToPlayer(place: S11FormationPlace): void {
    const s11Player = place.getPlayer();
    if (s11Player === undefined) {
      return;
    }
    this.linkToPlayer.emit(s11Player);
  }

  getSubstituteClass(isSubstitute: boolean): string {
    return isSubstitute ? 'table-no-bottom-border' : '';
  }

  getSubstitution(line: FootballLine): Substitution|undefined {
    return this.substitutions.find((substitution: Substitution): boolean => {
      return line === substitution.getLineNumberOut();
    });
  }

  hasLineSubstitution(footballLine: FootballLine): boolean {
    return this.substitutions.some((substitution: Substitution): boolean => {
      return footballLine === substitution.getLineNumberOut();
    });
  }

  substituteAction(place: S11FormationPlace): void {
    if( !this.hasLineSubstitution(place.getLine()) && !place.isSubstitute() ) {
      this.substitute.emit(place);
    } else if ( this.hasLineSubstitution(place.getLine()) && place.isSubstitute() ) {
      this.removeSubstitution(this.getSubstitution(place.getLine()));
    }
  }

  removeSubstitution(substitution: Substitution|undefined): void {
    console.log('removeSubstitution', substitution);
    if( substitution === undefined) {
      return;
    }
    this.remove.emit([substitution])
  }
}
