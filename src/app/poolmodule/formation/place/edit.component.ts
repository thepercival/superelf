import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Team, Person, TeamCompetitor } from 'ngx-sport';
import { S11Formation } from '../../../lib/formation';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { ViewPeriodType } from '../../../lib/period/view/json';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { PoolRepository } from '../../../lib/pool/repository';
import { PoolUser } from '../../../lib/pool/user';
import { PoolUserRepository } from '../../../lib/pool/user/repository';
import { ScoutedPlayer } from '../../../lib/scoutedPlayer';
import { GlobalEventsManager } from '../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../shared/poolmodule/component';
import { ChoosePlayersFilter, S11PlayerChooseComponent } from '../../player/choose.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: "app-pool-scouted-player-edit",
  standalone: true,
  imports: [FontAwesomeModule, NgbAlertModule, S11PlayerChooseComponent],
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class FormationPlaceEditComponent
  extends PoolComponent
  implements OnInit
{
  assembleFormation: S11Formation | undefined;
  scoutingList: ScoutingList = {
    scoutedPlayers: [] /*, mappedPersons: new PersonMap()*/,
  };
  public form: UntypedFormGroup;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public choosePlayersFilter: ChoosePlayersFilter;
  public place!: S11FormationPlace;
  public alreadyChosenPersons: Person[] = [];
  public alreadyChosenTeams: Team[] = [];
  public selectableLines: FootballLine[];
  public selectableTeams: Team[] = [];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    private location: Location,
    public myNavigation: MyNavigation,
    private modalService: NgbModal,
    fb: UntypedFormBuilder
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      showAll: false,
    });

    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    this.choosePlayersFilter = state
      ? state.playerFilter
      : { line: undefined, team: undefined };

    this.selectableLines = [];
    for (const [propertyKey, propertyValue] of Object.entries(FootballLine)) {
      if (typeof propertyValue === "string") {
        continue;
      }
      this.selectableLines.push(propertyValue);
    }
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.route.queryParams.subscribe((params) => {
        this.initPlayerChooseFilter(pool, params);
      });
      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: (poolUser: PoolUser) => {
          this.route.params.subscribe((params) => {
            if (params.placeId === undefined) {
              return;
            }
            this.formationRepository
              .getObject(poolUser, pool.getAssembleViewPeriod())
              .subscribe({
                next: (assembleFormation: S11Formation) => {
                  this.assembleFormation = assembleFormation;
                  this.initPlace(assembleFormation, +params.placeId);
                },
                error: (e: string) => {
                  this.setAlert("danger", e);
                  this.processing = false;
                },
                complete: () => (this.processing = false),
              });
            this.selectableTeams = pool
              .getSourceCompetition()
              .getTeamCompetitors()
              .map((teamCompetitor: TeamCompetitor) =>
                teamCompetitor.getTeam()
              );
          });
        },
        error: (e: string) => {
          this.setAlert("danger", e);
          this.processing = false;
        },
        complete: () => (this.processing = false),
      });
    });
  }

  get AssembleViewPeriod(): ViewPeriodType {
    return ViewPeriodType.Assemble;
  }

  private initPlace(assembleFormation: S11Formation, placeId: number) {
    this.place = this.getPlaceById(assembleFormation, placeId);
    this.initPlayerChoose(assembleFormation);
  }

  initPlayerChooseFilter(pool: Pool, params: Params) {
    this.form.controls.showAll.setValue(params.showAll === "true");
    if (params.line !== undefined) {
      this.choosePlayersFilter.line = +params.line;
    }
    if (params.teamId !== undefined) {
      this.choosePlayersFilter.team = this.getTeamById(pool, +params.teamId);
    }
  }

  initPlayerChoose(assembleFormation: S11Formation) {
    this.alreadyChosenPersons = [];
    this.alreadyChosenTeams = this.getChoosenTeams(assembleFormation);
    this.selectableLines = [this.place.getFormationLine().getNumber()];
  }

  getChoosenTeams(assembleFormation: S11Formation): Team[] {
    const teams: Team[] = [];
    assembleFormation.getPlayers().forEach((player: S11Player) => {
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

  getPlaceById(
    assembleFormation: S11Formation,
    placeId: number
  ): S11FormationPlace {
    const place = assembleFormation
      .getPlaces()
      .find((place: S11FormationPlace): boolean => {
        return place.getId() === placeId;
      });
    if (place === undefined) {
      throw Error("de opstellings-plaats kan niet gevonden worden");
    }
    return place;
  }

  getTeamById(pool: Pool, teamId: number): Team | undefined {
    const teamCompetitors = pool.getSourceCompetition().getTeamCompetitors();
    return teamCompetitors
      .map((teamCompetitor) => teamCompetitor.getTeam())
      .find((team: Team): boolean => {
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

  editPlace(pool: Pool, s11Player: S11Player) {
    this.processing = true;
    this.formationRepository
      .editPlace(this.place, s11Player.getPerson())
      .subscribe({
        next: () => {
          this.router.navigate(["/pool/formation/assemble/", pool.getId()]);
        },
        error: (e: string) => {
          this.setAlert("danger", e);
          this.processing = false;
        },
        complete: () => (this.processing = false),
      });
  }

  updateShowAll() {
    this.updateState(this.choosePlayersFilter);
  }

  updateState(choosePlayersFilter: ChoosePlayersFilter) {
    this.choosePlayersFilter = choosePlayersFilter;

    let params = new HttpParams();
    if (choosePlayersFilter.line) {
      params = params.set("line", choosePlayersFilter.line);
    }
    if (choosePlayersFilter.team) {
      params = params.set("teamId", choosePlayersFilter.team.getId());
    }
    params = params.set("showAll", this.form.controls.showAll.value);

    this.location.replaceState(location.pathname, params.toString(), undefined);
  }

  linkToPlayer(pool: Pool, s11Player: S11Player): void {
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), 0] /*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/
    );
  }

  toggleShowAll() {}
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}