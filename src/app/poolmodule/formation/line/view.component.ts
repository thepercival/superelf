import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Period, Person, Team } from 'ngx-sport';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { S11Player } from '../../../lib/player';
import { StatisticsGetter } from '../../../lib/statistics/getter';
import { CSSService } from '../../../shared/commonmodule/cssservice';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TeamNameComponent } from '../../team/name.component';
import { LineIconComponent } from '../../../shared/commonmodule/lineicon/lineicon.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SportExtensions } from '../../../lib/sportExtensions';
import { S11Formation } from '../../../lib/formation';
import { MinutesAsGradientsService } from '../../../shared/commonmodule/minutesAsGradientsService';
import { Statistics } from '../../../lib/statistics';

@Component({
  selector: "[app-pool-formationline-view]",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FontAwesomeModule,
    TeamNameComponent,
    LineIconComponent,
  ],
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
export class FormationLineViewComponent implements OnInit {
  readonly line = input.required<S11FormationLine>();
  readonly gameRounds = input.required<GameRound[]>();
  readonly statisticsGetter = input.required<StatisticsGetter>();
  readonly processing = model<boolean>(true);
  readonly previousFormation = input<S11Formation|undefined>();
  readonly totalPoints = input<number>();    
  @Output() linkToPlayer = new EventEmitter<PlayerLink>();

  public faSpinner = faSpinner;

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

  get GoalKeeper(): FootballLine {
    return FootballLine.GoalKeeper;
  }

  completed() {
    return this.line()
      .getPlaces()
      .every((place: S11FormationPlace) => place.getPlayer());
  }

  // getTeamImageUrl(team: Team | undefined): string {
  //   return team ? this.imageRepository.getTeamUrl(team) : "";
  // }

  getCurrentTeam(s11Player: S11Player | undefined, period: Period|undefined): Team | undefined {
    if (s11Player === undefined) {
      return undefined;
    }
    const player = this.sportExtensions.getPlayer(
      s11Player,
      period?.getStartDateTime() ?? new Date()
    );
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

  calculateTotalGameRoundPoints(formation: S11Formation, gameRound: GameRound): number {
    return this.statisticsGetter().getFormationGameRoundPoints(
          formation,
          gameRound,
          undefined
        );
  }

  // getTotalPoints(place: S11FormationPlace): number {
  //   const previousFormation = this.previousFormation();
  //   const points = place.getTotalPoints(undefined);
  //   const person = place.getPlayer()?.getPerson();
  //   if( previousFormation !== undefined && person !== undefined ) {      
  //     const previousPlace = previousFormation.getPlaceByPerson(person);
  //     if( previousPlace !== undefined ) {
  //       return points + previousPlace.getTotalPoints(undefined);
  //     }
  //   }
  //   return points;
  // }

  // getBorderClass(): string {
  //   return 'border-line-' + this.line.getNumber();
  // }

  // getBGColorClass(): string {
  //   return 'bg-color-line-' + this.line.getNumber();
  // }

  getLineClass(prefix: string): string {
    return this.cssService.getLine(this.line().getNumber(), prefix + "-");
  }

  maybeLinkToPlayer(place: S11FormationPlace, gameRound: GameRound): void {
    const s11Player = place.getPlayer();
    if (s11Player === undefined) {
      return;
    }
    this.linkToPlayer.emit({ s11Player, gameRound });
  }

  getSubstituteClass(isSubstitute: boolean): string {
    return isSubstitute ? "table-no-bottom-border" : "";
  }

  getAppearanceColumnsAsGradient(statistics: Statistics): string {
    return (new MinutesAsGradientsService()).getAppearanceColumnsAsGradient(statistics);
  }
}

export interface PlayerLink {
  s11Player: S11Player;
  gameRound: GameRound
}