import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { ScoutedPlayer } from '../../lib/scoutedPlayer';
import { Pool } from '../../lib/pool';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { ViewPeriod } from '../../lib/period/view';
import { Person, Team } from 'ngx-sport';
import { PlayerAction, S11PlayerAddRemoveModalComponent } from '../player/addremovemodal.component';
import { PoolUser } from '../../lib/pool/user';

@Component({
  selector: 'app-pool-scouting-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ScoutedPlayerListComponent extends PoolComponent implements OnInit {
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    private modalService: NgbModal,
    private poolUserRepository: PoolUserRepository
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.initPoolUser(pool);
      this.initScoutedPlayers(pool);
    });
  }

  initPoolUser(pool: Pool) {
    this.poolUserRepository.getObjectFromSession(pool)
      .subscribe({
        next: (poolUser: PoolUser | undefined) => {
          this.poolUser = poolUser;
          console.log(poolUser);
        },
        error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
      });
  }

  initScoutedPlayers(pool: Pool) {
    this.scoutedPlayerRepository.getObjects(pool.getSourceCompetition(), pool.getCreateAndJoinPeriod()).subscribe({
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
  }

  protected removeFromToScoutingList(scoutedPlayer: ScoutedPlayer) {
    this.scoutingList.scoutedPlayers.splice(this.scoutingList.scoutedPlayers.indexOf(scoutedPlayer), 1);
  }

  public getPersons(): Person[] {
    return this.scoutingList.scoutedPlayers.map((scoutedPlayer: ScoutedPlayer) => scoutedPlayer.getPerson());
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

  openRemoveModal(scoutedPlayer: ScoutedPlayer, pool: Pool) {
    const modalRef = this.modalService.open(S11PlayerAddRemoveModalComponent);
    modalRef.componentInstance.s11Player = scoutedPlayer.getS11Player();
    modalRef.componentInstance.action = PlayerAction.Remove;
    modalRef.result.then((s11Player: S11Player) => {
      if (s11Player === scoutedPlayer.getS11Player()) {
        this.remove(scoutedPlayer, pool.getCreateAndJoinPeriod());
      }
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

  showCopyToTeam(): boolean {
    return this.pool.getAssemblePeriod().isIn() && this.poolUser?.getAssembleFormation() !== undefined;
  }

  copyToTeam(s11Player: S11Player) {

  }

  linkToPlayer(s11Player: S11Player | undefined): void {
    if (!s11Player) {
      return;
    }

    this.router.navigate(['/pool/player/', this.pool.getId()], {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    });
  }

  linkToSearch() {
    this.router.navigate(['/pool/scouting/search/', this.pool.getId()]);
  }

}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}