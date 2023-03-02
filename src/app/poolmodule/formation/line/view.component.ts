import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Person, Team } from 'ngx-sport';
import { S11FormationLine } from '../../../lib/formation/line';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { GameRound } from '../../../lib/gameRound';
import { ImageRepository } from '../../../lib/image/repository';
import { SuperElfNameService } from '../../../lib/nameservice';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { StatisticsGetter } from '../../../lib/statistics/getter';
import { CSSService } from '../../../shared/commonmodule/cssservice';

@Component({
  selector: '[app-pool-formationline-view]',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class FormationLineViewComponent implements OnInit {
  @Input() line!: S11FormationLine;
  @Input() gameRound!: GameRound;
  @Input() statisticsGetter!: StatisticsGetter;
  @Input() processing: boolean = true;
  @Input() totalPoints: number|undefined;
  @Input() totalGameRoundPoints: number|undefined;
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

  get GoalKeeper(): FootballLine { return FootballLine.GoalKeeper; }
  
  completed() {
    return this.line.getPlaces().every((place: S11FormationPlace) => place.getPlayer());
  }

  getTeamImageUrl(s11Player: S11Player): string {
    const team = this.getCurrentTeam(s11Player);
    return team ? this.imageRepository.getTeamUrl(team) : '';
  }

  getCurrentTeam(s11Player: S11Player | undefined): Team | undefined {
    if (s11Player === undefined ) {
      return undefined;
    }
    let date;
    if( this.gameRound !== undefined ) {
      const stats = this.statisticsGetter.getStatistics(s11Player, this.gameRound);
      date = stats?.getGameStartDate();
    }
    const player = this.oneTeamSimultaneous.getPlayer(s11Player, date ?? new Date());
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
}
