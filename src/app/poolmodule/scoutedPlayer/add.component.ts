import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { ScoutedPlayer } from '../../lib/scoutedPlayer';
import { Pool } from '../../lib/pool';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../lib/player';
import { FootballLine, Person, Team, TeamCompetitor } from 'ngx-sport';
import { HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { PlayerAction, S11PlayerAddRemoveModalComponent } from '../player/addremovemodal.component';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { ChoosePlayersFilter } from '../player/choose.component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { ViewPeriodType } from '../../lib/period/view/json';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';

@Component({
  selector: 'app-pool-scouted-player-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ScoutedPlayerAddComponent extends PoolComponent implements OnInit {
  form: UntypedFormGroup;
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public choosePlayersFilter: ChoosePlayersFilter;
  public selectableTeams!: Team[];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    fb: UntypedFormBuilder,
    private location: Location,
    public myNavigation: MyNavigation,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      url: [{ value: '', disabled: true }, Validators.compose([
      ])],
    });
    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    this.choosePlayersFilter = state ? state.playerFilter : { line: undefined, team: undefined };
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: ((poolUser: PoolUser) => {
          this.poolUserFromSession = poolUser;
        })
      });
      this.selectableTeams = this.pool.getSourceCompetition().getTeamCompetitors().map((teamCompetitor: TeamCompetitor) => teamCompetitor.getTeam())  
      this.route.queryParams.subscribe(params => {
        if (params.line !== undefined) {
          this.choosePlayersFilter.line = +params.line;
        }
        if (params.teamId !== undefined) {
          this.choosePlayersFilter.team = this.getTeamById(+params.teamId);
        }
      });
      this.initScoutedPlayers(pool);
    });
  }

  get Scouting(): NavBarItem { return NavBarItem.Scouting }
  
  getTeamById(teamId: number): Team | undefined {
    const teamCompetitors = this.pool.getSourceCompetition().getTeamCompetitors();
    return teamCompetitors.map(teamCompetitor => teamCompetitor.getTeam()).find((team: Team): boolean => {
      return team.getId() === teamId;
    });
  }

  initScoutedPlayers(pool: Pool) {
    this.scoutedPlayerRepository.getObjects(pool.getSourceCompetition(), pool.getCreateAndJoinPeriod()).subscribe({
      next: (scoutedPlayers: ScoutedPlayer[]) => {
        // console.log('test');
        scoutedPlayers.forEach(scoutedPlayer => this.addToScoutingList(scoutedPlayer));
        this.processing = false;
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

  public getPersons(): Person[] {
    return this.scoutingList.scoutedPlayers.map((scoutedPlayer: ScoutedPlayer) => scoutedPlayer.getPerson());
  }

  get AssembleViewPeriod(): ViewPeriodType { return ViewPeriodType.Assemble; }

  openAddModal(s11Player: S11Player) {
    // console.log(s11Player);
    const modalRef = this.modalService.open(S11PlayerAddRemoveModalComponent);
    modalRef.componentInstance.s11Player = s11Player;
    modalRef.componentInstance.scorePointsMap = this.pool.getCompetitionConfig().getScorePointsMap();
    modalRef.componentInstance.action = PlayerAction.Add;
    modalRef.result.then((s11PlayerResult: S11Player) => {
      this.add(s11PlayerResult);
    });
  }

  private add(s11Player: S11Player) {
    if (!this.pool) {
      return;
    }
    this.processing = true;
    this.scoutedPlayerRepository.createObject(s11Player, this.pool.getSourceCompetition(), this.pool.getCreateAndJoinPeriod()).subscribe({
      next: (scoutedPlayer: ScoutedPlayer) => {
        this.addToScoutingList(scoutedPlayer);
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
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

  updateState(choosePlayersFilter: ChoosePlayersFilter) {
    this.choosePlayersFilter = choosePlayersFilter;

    let params = new HttpParams();
    if (choosePlayersFilter.line) {
      params = params.set('line', choosePlayersFilter.line);
    }
    if (choosePlayersFilter.team) {
      params = params.set('teamId', choosePlayersFilter.team.getId());
    }

    this.location.replaceState(
      location.pathname,
      params.toString(),
      undefined
    );
  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}