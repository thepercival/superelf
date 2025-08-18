import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, Player, Team } from 'ngx-sport';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { S11Player } from '../../../lib/player';
import { CSSService } from '../../../shared/commonmodule/cssservice';
import { LineIconComponent } from '../../../shared/commonmodule/lineicon/lineicon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TeamNameComponent } from '../../team/name.component';
import { NgTemplateOutlet } from '@angular/common';
import { faSpinner, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { SportExtensions } from '../../../lib/sportExtensions';
import { MarketValueComponent } from "../../../shared/commonmodule/marketvalue/marketvalue.component";

@Component({
  selector: "[app-pool-formationline-assemble]",
  standalone: true,
  imports: [
    LineIconComponent,
    FontAwesomeModule,
    TeamNameComponent,
    NgTemplateOutlet,
    MarketValueComponent
],
  templateUrl: "./assemble.component.html",
  styleUrls: ["./assemble.component.scss"],
})
export class FormationLineAssembleComponent implements OnInit {
  public readonly line = input.required<S11FormationLine>();
  public readonly selectedPlace = input<S11FormationPlace>();
  public readonly viewGameRound = input<GameRound>();
  readonly totalMarketValue = input<number>();
  public readonly processing = model<boolean>(true);
  @Output() editPlace = new EventEmitter<S11FormationPlace>();
  @Output() linkToPlayer = new EventEmitter<S11Player>();

  public faSpinner = faSpinner;
  public faPencilAlt = faPencilAlt;
  public faTrashAlt = faTrashAlt;

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
    const player = this.getCurrentPlayer(s11Player);
    return player !== undefined ? this.imageRepository.getTeamUrl(player.getTeam()) : "";
  }

  getCurrentPlayer(s11Player: S11Player | undefined): Player | undefined {
    if (!s11Player) {
      return undefined;
    }
    return this.sportExtensions.getCurrentPlayer(s11Player);
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
}
