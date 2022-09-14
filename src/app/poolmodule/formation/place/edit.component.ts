import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Team, Person } from 'ngx-sport';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { PoolRepository } from '../../../lib/pool/repository';
import { PoolUser } from '../../../lib/pool/user';
import { PoolUserRepository } from '../../../lib/pool/user/repository';
import { ScoutedPlayer } from '../../../lib/scoutedPlayer';
import { GlobalEventsManager } from '../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../shared/poolmodule/component';
import { ChoosePlayersFilter } from '../../player/choose.component';

@Component({
  selector: 'app-pool-scouted-player-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class FormationPlaceEditComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public form: UntypedFormGroup;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public choosePlayersFilter: ChoosePlayersFilter;
  public place!: S11FormationPlace;
  public alreadyChosenPersons: Person[] = [];
  public alreadyChosenTeams: Team[] = [];
  public selectableLine: FootballLine | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    private location: Location,
    private formationRepository: FormationRepository,
    public myNavigation: MyNavigation,
    private modalService: NgbModal,
    fb: UntypedFormBuilder
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      showAll: false
    });

    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    this.choosePlayersFilter = state ? state.playerFilter : { line: undefined, team: undefined };
  }


  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.route.queryParams.subscribe(params => {
        this.initPlayerChooseFilter(params);
      });
      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: (poolUser: PoolUser) => {
          this.poolUser = poolUser;
          this.route.params.subscribe(params => {
            if (params.placeId !== undefined) {
              this.initPlace(+params.placeId);;
            }
          });

          // const s11Formation = poolUser.getAssembleFormation();
          // if (!s11Formation) {
          //   this.form.controls.formation.setValue(undefined);
          //   return;
          // }
          // this.assembleLines = this.getAssembleLines(formation);
        },
        error: (e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        complete: () => this.processing = false
      });
    });
  }

  private initPlace(placeId: number) {
    this.place = this.getPlaceById(placeId);
    this.initPlayerChoose();
  }

  initPlayerChooseFilter(params: Params) {
    this.form.controls.showAll.setValue(params.showAll === 'true');
    if (params.line !== undefined) {
      this.choosePlayersFilter.line = +params.line;
    }
    if (params.teamId !== undefined) {
      this.choosePlayersFilter.team = this.getTeamById(+params.teamId);
    }
  }

  initPlayerChoose() {
    this.alreadyChosenPersons = [];
    this.alreadyChosenTeams = this.getChoosenTeams();
    this.selectableLine = this.place.getFormationLine().getNumber();
  }

  getChoosenTeams(): Team[] {
    const teams: Team[] = [];
    this.poolUser.getAssembleFormation()?.getPlayers().forEach((player: S11Player) => {
      const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player);
      if (currentPlayer === undefined) {
        return;
      }
      teams.push(currentPlayer.getTeam());
    });

    // const person: Person | undefined = selectedS11Player?.getPerson();
    // const currentPlayer = person ? this.oneTeamSimultaneous.getCurrentPlayer(person) : undefined;
    // const team: Team | undefined = currentPlayer ? currentPlayer.getTeam() : undefined;
    // if (team === undefined) {
    //   return teams;
    // }
    // const index = teams.indexOf(team);
    // if (index > -1) {
    //   teams.splice(index, 1);
    // }
    return teams;
  }

  getPlaceById(placeId: number): S11FormationPlace {
    const formation = this.poolUser.getAssembleFormation();

    const place = formation?.getPlaces().find((place: S11FormationPlace): boolean => {
      return place.getId() === placeId;
    });
    if (place === undefined) {
      throw Error('de opstellings-plaats kan niet gevonden worden');
    }
    return place;
  }

  getTeamById(teamId: number): Team | undefined {
    const teamCompetitors = this.pool.getSourceCompetition().getTeamCompetitors();
    return teamCompetitors.map(teamCompetitor => teamCompetitor.getTeam()).find((team: Team): boolean => {
      return team.getId() === teamId;
    });
  }


  // getAssembleLines(formation?: S11Formation): AssembleLine[] {
  //   const assembleLines: AssembleLine[] = [];
  //   if (!formation) {
  //     return assembleLines;
  //   }
  //   formation.getLines().forEach((formationLine: S11FormationLine) => {
  //     const players = formationLine.getPlayers().slice();
  //     const places: AssembleLinePlace[] = [];
  //     for (let i = 1; i <= formationLine.getNrOfPersons(); i++) {
  //       const player = players.shift();
  //       places.push({
  //         lineNumber: formationLine.getNumber(),
  //         number: 1,
  //         player,
  //         substitute: false
  //       });
  //     }
  //     const substitute: AssembleLinePlace = {
  //       lineNumber: formationLine.getNumber(),
  //       number: 1,
  //       player: formationLine.getSubstitute(),
  //       substitute: true
  //     };
  //     assembleLines.push({
  //       number: formationLine.getNumber(), places, substitute
  //     });
  //   });
  //   return assembleLines;
  // }



  editPlace(s11Player: S11Player) {
    this.processing = true;
    this.formationRepository.editPlace(this.place, s11Player.getPerson()).subscribe({
      next: () => {
        this.router.navigate(['/pool/formation/assemble/', this.pool.getId()]);
      },
      error: (e: string) => {
        this.setAlert('danger', e);
        this.processing = false
      },
      complete: () => this.processing = false
    });
  }


  updateShowAll() {
    this.updateState(this.choosePlayersFilter);
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
    params = params.set('showAll', this.form.controls.showAll.value);

    this.location.replaceState(
      location.pathname,
      params.toString(),
      undefined
    );
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  toggleShowAll() {

  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}