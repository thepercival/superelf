import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, Team } from 'ngx-sport';
import { Replacement } from '../../../lib/editAction/replacement';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { GameRepository } from '../../../lib/ngx-sport/game/repository';
import { S11Player } from '../../../lib/player';
import { CSSService } from '../../../shared/commonmodule/cssservice';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TeamNameComponent } from '../../team/name.component';
import { LineIconComponent } from '../../../shared/commonmodule/lineicon/lineicon.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { faSpinner, faPencilAlt, faTrashAlt, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { SportExtensions } from '../../../lib/sportExtensions';

@Component({
  selector: "app-pool-formationline-replacements",
  standalone: true,
  imports: [
    NgIf,
    FontAwesomeModule,
    TeamNameComponent,
    LineIconComponent,
    NgTemplateOutlet,
  ],
  templateUrl: "./replacements.component.html",
  styleUrls: ["./replacements.component.scss"],
})
export class FormationLineReplacementsComponent implements OnInit {
  readonly line = input.required<S11FormationLine>();
  readonly selectedPlace = input<S11FormationPlace>();
  readonly viewGameRound = input<GameRound>();
  readonly replacements = input<Replacement[]>([]);
  readonly processing = model<boolean>(true);
  @Output() replace = new EventEmitter<S11FormationPlace>();
  @Output() remove = new EventEmitter<Replacement>();
  @Output() linkToPlayer = new EventEmitter<S11Player>();

  public faSpinner = faSpinner;
  public faPencilAlt = faPencilAlt;
  public faTrashAlt = faTrashAlt;
  public faRightLeft = faRightLeft;

  constructor(
    public imageRepository: ImageRepository,
    public superElfNameService: SuperElfNameService,
    private formationRepository: FormationRepository,
    private modalService: NgbModal,
    private cssService: CSSService,
    public sportExtensions: SportExtensions
  ) {}

  ngOnInit() {
    this.processing.set(false);
  }

  completed() {
    return this.line()
      .getPlaces()
      .every((place: S11FormationPlace) => place.getPlayer());
  }

  getTeamImageUrl(s11Player: S11Player): string {
    const team = this.getCurrentTeam(s11Player);
    return team ? this.imageRepository.getTeamUrl(team) : "";
  }

  getCurrentTeam(s11Player: S11Player | undefined): Team | undefined {
    if (!s11Player) {
      return undefined;
    }
    const player = this.sportExtensions.getCurrentPlayer(s11Player);
    if (!player) {
      return undefined;
    }
    return player.getTeam();
  }

  emptyPlace(place: S11FormationPlace) {
    this.processing.set(true);
    this.formationRepository.editPlace(place, undefined).subscribe({
      next: () => {},
      complete: () => this.processing.set(false),
    });
  }

  // getBorderClass(): string {
  //   return 'border-line-' + this.line.getNumber();
  // }

  // getBGColorClass(): string {
  //   return 'bg-color-line-' + this.line.getNumber();
  // }

  getLineClass(prefix: string): string {
    return this.cssService.getLine(this.line().getNumber(), prefix + "-");
  }

  getPointsTotalsClass() {
    return this.viewGameRound() === undefined ? "bg-totals" : "bg-points";
  }

  maybeLinkToPlayer(place: S11FormationPlace): void {
    const s11Player = place.getPlayer();
    if (s11Player === undefined) {
      return;
    }
    this.linkToPlayer.emit(s11Player);
  }

  getSubstituteClass(isSubstitute: boolean): string {
    return isSubstitute ? "table-no-bottom-border" : "";
  }

  replaceAction(place: S11FormationPlace, currentTeam: Team | undefined): void {
    if (!currentTeam) {
      this.replace.emit(place);
    } else if (this.getReplacement(place)) {
      this.remove.emit(this.getReplacement(place));
    }
  }

  getReplacement(place: S11FormationPlace): Replacement | undefined {
    return this.replacements().find((replacement: Replacement): boolean => {
      const player = place.getPlayer()?.getPlayersDescendingStart().shift();
      return player !== undefined && player === replacement.getPlayerIn();
    });
  }
}
