import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { ScoutedPlayer } from '../../lib/scoutedPlayer';
import { Pool } from '../../lib/pool';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveApprovalModalComponent } from '../removeapproval/removeapprovalmodal.component';
import { ConfirmS11PlayerChoiceModalComponent } from '../chooseplayers/confirmchoicemodal.component';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { ViewPeriod } from '../../lib/period/view';
import { Person, Team } from 'ngx-sport';
import { S11PlayerInfoModalComponent } from '../player/infomodal.component';

@Component({
  selector: 'app-pool-scouting',
  templateUrl: './scouting.component.html',
  styleUrls: ['./scouting.component.scss']
})
export class ScoutingComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  showSearch: boolean = false;
  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      url: [{ value: '', disabled: true }, Validators.compose([
      ])],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.initScoutedPlayers(pool);
    });
  }

  initScoutedPlayers(pool: Pool) {
    this.scoutedPlayerRepository.getObjects(pool.getCreateAndJoinPeriod()).subscribe({
      next: (scoutedPlayers: ScoutedPlayer[]) => {
        scoutedPlayers.forEach(scoutedPlayer => this.addToScoutingList(scoutedPlayer))
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }

  protected addToScoutingList(scoutedPlayer: ScoutedPlayer) {
    this.scoutingList.scoutedPlayers.push(scoutedPlayer);
    // this.scoutingList.mappedPersons.set(+scoutedPlayer.getPerson().getId(), scoutedPlayer.getPerson());
  }

  protected removeFromToScoutingList(scoutedPlayer: ScoutedPlayer) {
    this.scoutingList.scoutedPlayers.splice(this.scoutingList.scoutedPlayers.indexOf(scoutedPlayer), 1);
    // this.scoutingList.mappedPersons.delete(+scoutedPlayer.getPerson().getId());
  }

  public getPersons(): Person[] {
    return this.scoutingList.scoutedPlayers.map((scoutedPlayer: ScoutedPlayer) => scoutedPlayer.getPerson());
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

  openRemoveApprovalModal(scoutedPlayer: ScoutedPlayer, pool: Pool) {
    const modalRef = this.modalService.open(RemoveApprovalModalComponent);
    modalRef.componentInstance.entittyName = 'gescoute speler';
    modalRef.componentInstance.name = scoutedPlayer.getPerson().getName();
    modalRef.result.then((result) => {
      this.remove(scoutedPlayer, pool.getCreateAndJoinPeriod());
    }, (reason) => {
    });
  }

  remove(scoutedPlayer: ScoutedPlayer, viewPeriod: ViewPeriod) {
    this.processing = true;
    this.scoutedPlayerRepository.removeObject(scoutedPlayer, viewPeriod).subscribe({
      next: () => {
        this.removeFromToScoutingList(scoutedPlayer);
        // this.setAlert('success', '"' + scoutedPlayer.getPerson().getName() + '" verwijderd');
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }

  add(s11Player: S11Player) {
    if (!this.pool) {
      return;
    }
    this.processing = true;
    this.scoutedPlayerRepository.createObject(s11Player, this.pool.getCreateAndJoinPeriod()).subscribe({
      next: (scoutedPlayer: ScoutedPlayer) => {
        // this.scoutingList.mappedPersons = new PersonMap();
        this.addToScoutingList(scoutedPlayer);
        this.openConfirmModal(scoutedPlayer.getS11Player());
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }

  openConfirmModal(s11Player: S11Player) {
    const modalRef = this.modalService.open(ConfirmS11PlayerChoiceModalComponent);
    modalRef.componentInstance.s11Player = s11Player;
    modalRef.result.then((result) => {
      if (result === 'goback') {
        this.showSearch = false;
      }
    }, (reason) => {
    });
  }

  copyToTeam(s11Player: S11Player) {

  }

  showPlayer(s11Player: S11Player | undefined): void {
    if (!s11Player) {
      return;
    }
    const modalRef = this.modalService.open(S11PlayerInfoModalComponent);
    modalRef.componentInstance.s11Player = s11Player;
    modalRef.componentInstance.points = this.pool.getPoints();
    // modalRef.componentInstance.name = poolUser.getName();
    modalRef.result.then((result) => {
      // this.remove(poolUser);
    }, (reason) => {
    });
  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}
