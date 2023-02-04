import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person, Team } from 'ngx-sport';
import { Transfer } from '../../../lib/editAction/transfer';
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
  selector: 'app-pool-formationline-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class FormationLineTransfersComponent implements OnInit {
  @Input() line!: S11FormationLine;
  @Input() selectedPlace: S11FormationPlace | undefined;
  @Input() viewGameRound: GameRound | undefined;
  @Input() processing: boolean = true;
  @Input() transfers: Transfer[] = [];
  @Output() transfer = new EventEmitter<S11FormationPlace>();
  @Output() linkToPlayer = new EventEmitter<S11Player>();
  @Output() remove = new EventEmitter<Transfer[]>();

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

  // isTransfer(place: S11FormationPlace): boolean {
  //   const s11Player = place.getPlayer();
  //   if( s11Player === undefined) {
  //     return false;
  //   }
  //   const pool = place.getFormationLine().getFormation().getPoolUser().getPool();
  //   const transferPeriodStart = pool.getCompetitionConfig().getTransferPeriod().getStartDateTime();
  //   const player = (new OneTeamSimultaneous()).getPlayer(s11Player, transferPeriodStart);
  //   if( player === undefined) {
  //     return false;
  //   }
  //   console.log(this.transfers, player);
  //   return this.transfers.some((transfer: Transfer): boolean => {
  //     return transfer.getPlayerIn() === player;
  //   });

  getTransfer(place: S11FormationPlace): Transfer|undefined {
    return this.transfers.find((transfer: Transfer): boolean => {
      const player = place.getPlayer()?.getPlayersDescendingStart().shift();
      return player !== undefined && player === transfer.getPlayerIn();
    });
  }

  removeTransfer(transfer: Transfer|undefined): void {
    if( transfer === undefined) {
      return;
    }
    if( transfer.getPoolUser().hasDoubleTransfer() ) {
      this.remove.emit(transfer.getPoolUser().getTransfers())
    } else {
      this.remove.emit([transfer])
    }
  }
}
