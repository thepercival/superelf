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
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { ViewPeriod } from '../../lib/period/view';
import { FootballLine, Person, Team } from 'ngx-sport';
import { PlayerAction, S11PlayerAddRemoveModalComponent } from '../player/addremovemodal.component';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { S11FormationPlace } from '../../lib/formation/place';

@Component({
  selector: 'app-pool-scouting-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ScoutedPlayerListComponent extends PoolComponent implements OnInit {
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  private assembleFormationPlayers: S11Player[] | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    private modalService: NgbModal,
    private poolUserRepository: PoolUserRepository,
    private formationRepository: FormationRepository
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.initPoolUser(pool);

    });
  }

  initPoolUser(pool: Pool) {
    this.poolUserRepository.getObjectFromSession(pool)
      .subscribe({
        next: (poolUser: PoolUser | undefined) => {
          this.poolUser = poolUser;
          // console.log(poolUser);
          // need to know team first
          this.initScoutedPlayers(pool);
        },
        error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
      });
  }

  initScoutedPlayers(pool: Pool) {
    this.scoutedPlayerRepository.getObjects(pool.getSourceCompetition(), pool.getCreateAndJoinPeriod()).subscribe({
      next: (scoutedPlayers: ScoutedPlayer[]) => {
        scoutedPlayers.forEach(scoutedPlayer => this.addToScoutingList(scoutedPlayer))
        if (pool.getAssemblePeriod().isIn()) {
          this.assembleFormationPlayers = this.poolUser?.getAssembleFormation()?.getPlayers();
        }
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

  showCopyToTeam(s11Player: S11Player): boolean {
    const assembleFormation = this.poolUser?.getAssembleFormation();
    const assembleFormationPlayers = this.assembleFormationPlayers;
    //console.log(assembleFormationPlayers, assembleFormationPlayers?.indexOf(s11Player), s11Player);
    return assembleFormation !== undefined &&
      assembleFormationPlayers !== undefined && assembleFormationPlayers.find((s11PlayerIt: S11Player): boolean => {
        return s11PlayerIt.getPerson() === s11Player.getPerson();
      }) === undefined;
  }

  copyToTeam(s11Player: S11Player) {

    const firstEmptyPlace = this.getFirstEmptyPlace(s11Player.getLine());
    if (firstEmptyPlace === undefined) {
      this.setAlert('danger', 'er is geen vrije plek in deze linie');
      return;
    }

    this.processing = true;
    this.formationRepository.editPlace(firstEmptyPlace, s11Player.getPerson()).subscribe({
      next: () => {
        // this.router.navigate(['/pool/formation/assemble/', this.pool.getId()]);
        this.setAlert('success', 'speler is toegevoegd aan je team');
      },
      error: (e: string) => {
        this.setAlert('danger', e);
        this.processing = false
      },
      complete: () => this.processing = false
    });

  }

  getFirstEmptyPlace(line: FootballLine): S11FormationPlace | undefined {
    const assembleFormation = this.poolUser?.getAssembleFormation();
    if (assembleFormation === undefined) {
      return undefined;
    }
    const formationLine = assembleFormation.getLine(line);
    const firstEmptyPlace = formationLine.getStartingPlaces().find((formationPlace: S11FormationPlace): boolean => {
      return formationPlace.getPlayer() === undefined;
    });
    if (firstEmptyPlace !== undefined) {
      return firstEmptyPlace;
    }
    if (formationLine.getSubstitute().getPlayer() === undefined) {
      return formationLine.getSubstitute();
    }
    return undefined;
  }


  linkToPlayer(s11Player: S11Player | undefined): void {
    //console.log(s11Player);
    if (!s11Player) {
      return;
    }

    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  linkToSearch() {
    this.router.navigate(['/pool/scouting/search/', this.pool.getId()]);
  }

}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}