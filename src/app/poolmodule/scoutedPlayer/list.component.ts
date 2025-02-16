import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { ScoutedPlayer } from '../../lib/scoutedPlayer';
import { Pool } from '../../lib/pool';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { ViewPeriod } from '../../lib/period/view';
import { Person, Team } from 'ngx-sport';
import { PlayerAction, S11PlayerAddRemoveModalComponent } from '../player/addremovemodal.component';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { S11FormationPlace } from '../../lib/formation/place';
import { S11FormationLine } from '../../lib/formation/line';
import { S11Formation } from '../../lib/formation';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TeamNameComponent } from '../team/name.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgIf } from '@angular/common';
import { faSearch, faSignInAlt, faSpinner, faTrashAlt, faUsers, faUserSecret } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [
    PoolNavBarComponent,
    LineIconComponent,
    FontAwesomeModule,
    TeamNameComponent,
    NgbAlertModule,
    NgIf,
  ],
  selector: "app-pool-scouting-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ScoutedPlayerListComponent
  extends PoolComponent
  implements OnInit
{
  scoutingList: ScoutingList = {
    scoutedPlayers: [] /*, mappedPersons: new PersonMap()*/,
  };
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public assembleFormation: S11Formation | undefined;
  public faSpinner = faSpinner;
  public faTrashAlt = faTrashAlt;
  public faSignInAlt = faSignInAlt;
  public faSearch = faSearch;
  public faUsers = faUsers;
  public faUserSecret = faUserSecret;

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

  get Scouting(): NavBarItem {
    return NavBarItem.Scouting;
  }

  initPoolUser(pool: Pool) {
    this.poolUserRepository.getObjectFromSession(pool).subscribe({
      next: (poolUser: PoolUser | undefined) => {
        this.poolUserFromSession = poolUser;
        if (
          pool.getAssemblePeriod().isIn() &&
          poolUser?.hasAssembleFormation()
        ) {
          this.formationRepository
            .getObject(poolUser, pool.getAssembleViewPeriod())
            .subscribe({
              next: (formation: S11Formation) => {
                this.assembleFormation = formation;
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
            });
        }

        // console.log(poolUser);
        // need to know team first
        this.initScoutedPlayers(pool);
      },
      error: (e: string) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  initScoutedPlayers(pool: Pool) {
    this.scoutedPlayerRepository
      .getObjects(pool.getSourceCompetition(), pool.getCreateAndJoinPeriod())
      .subscribe({
        next: (scoutedPlayers: ScoutedPlayer[]) => {
          scoutedPlayers.forEach((scoutedPlayer) =>
            this.addToScoutingList(scoutedPlayer)
          );
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
        complete: () => this.processing.set(false),
      });
  }

  protected addToScoutingList(scoutedPlayer: ScoutedPlayer) {
    this.scoutingList.scoutedPlayers.push(scoutedPlayer);
  }

  protected removeFromToScoutingList(scoutedPlayer: ScoutedPlayer) {
    this.scoutingList.scoutedPlayers.splice(
      this.scoutingList.scoutedPlayers.indexOf(scoutedPlayer),
      1
    );
  }

  public getPersons(): Person[] {
    return this.scoutingList.scoutedPlayers.map(
      (scoutedPlayer: ScoutedPlayer) => scoutedPlayer.getPerson()
    );
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
    modalRef.componentInstance.scorePointsMap = pool
      .getCompetitionConfig()
      .getScorePointsMap();
    modalRef.componentInstance.action = PlayerAction.Remove;
    modalRef.result.then(
      (s11Player: S11Player) => {
        if (s11Player === scoutedPlayer.getS11Player()) {
          this.remove(scoutedPlayer, pool.getCreateAndJoinPeriod());
        }
      },
      (reason) => {}
    );
  }

  remove(scoutedPlayer: ScoutedPlayer, viewPeriod: ViewPeriod) {
    this.processing.set(true);
    this.scoutedPlayerRepository
      .removeObject(scoutedPlayer, viewPeriod)
      .subscribe({
        next: () => {
          this.removeFromToScoutingList(scoutedPlayer);
          // this.setAlert('success', '"' + scoutedPlayer.getPerson().getName() + '" verwijderd');
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
        complete: () => this.processing.set(false),
      });
  }

  showCopyToTeam(
    assembleFormation: S11Formation,
    s11Player: S11Player
  ): boolean {
    const assembleFormationPlayers = assembleFormation.getPlayers();
    //console.log(assembleFormationPlayers, assembleFormationPlayers?.indexOf(s11Player), s11Player);
    return (
      assembleFormationPlayers !== undefined &&
      assembleFormationPlayers.find((s11PlayerIt: S11Player): boolean => {
        return s11PlayerIt.getPerson() === s11Player.getPerson();
      }) === undefined
    );
  }

  copyToTeam(assembleFormation: S11Formation, s11Player: S11Player) {
    const formationLine = assembleFormation.getLine(s11Player.getLine());
    const firstEmptyPlace = this.getFirstEmptyPlace(formationLine);
    if (firstEmptyPlace === undefined) {
      this.setAlert("danger", "er is geen vrije plek in deze linie");
      return;
    }

    this.processing.set(true);
    this.formationRepository
      .editPlace(firstEmptyPlace, s11Player.getPerson())
      .subscribe({
        next: () => {
          // this.router.navigate(['/pool/formation/assemble/', this.pool.getId()]);
          this.setAlert("success", "speler is toegevoegd aan je team");
        },
        error: (e: string) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
        complete: () => this.processing.set(false),
      });
  }

  getFirstEmptyPlace(
    formationLine: S11FormationLine
  ): S11FormationPlace | undefined {
    const firstEmptyPlace = formationLine
      .getStartingPlaces()
      .find((formationPlace: S11FormationPlace): boolean => {
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

  linkToPlayer(pool: Pool, s11Player: S11Player | undefined): void {
    //console.log(s11Player);
    if (!s11Player) {
      return;
    }

    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), 0] /*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/
    );
  }

  linkToSearch(pool: Pool) {
    this.router.navigate(["/pool/scouting/search/", pool.getId()]);
  }

  getTotalPoints(pool: Pool, s11Player: S11Player): number {
    const lineScorePointsMap = pool.getCompetitionConfig().getScorePointsMap();
    return s11Player.getTotalPoints(lineScorePointsMap, undefined);
  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}