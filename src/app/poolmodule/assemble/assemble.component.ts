import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, TeamMap, CustomSport, Team, Player, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { ActiveConfig } from '../../lib/pool/activeConfig';
import { JsonFormationShell } from '../../lib/activeConfig/json';
import { concatMap, map, pairwise } from 'rxjs/operators';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { Formation } from '../../lib/formation';
import { FormationLineMapper } from '../../lib/formation/line/mapper';
import { FormationLine } from '../../lib/formation/line';
import { SuperElfNameService } from '../../lib/nameservice';
import { FormationRepository } from '../../lib/formation/repository';
import { AssembleLine, AssembleLinePlace } from './assembleline.component';
import { Observable, of } from 'rxjs';
import { S11Player } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';

@Component({
  selector: 'app-pool-assemble',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class AssembleComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  availableFormations: JsonFormationShell[] = [];
  poolUser!: PoolUser;
  nameService = new NameService();
  superElfNameService = new SuperElfNameService();
  assembleLines: AssembleLine[] = [];
  showSearchSMDown: boolean = false;
  teamPersonMap = new PersonMap();
  selectedPlace: AssembleLinePlace | undefined;
  changingFormation = false;
  updatingPlayer = false;
  selectedSearchLine: number = FootballLine.All;
  selectedTeamMap: TeamMap = new TeamMap();
  public oneTeamSimultaneous = new OneTeamSimultaneous();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    protected activeConfigRepository: ActiveConfigRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      formation: [undefined]
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;

      this.activeConfigRepository.getObject().pipe(
        concatMap((config: ActiveConfig) => {
          this.availableFormations = config.getAvailableFormations();
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      ).subscribe(
        /* happy path */(poolUser: PoolUser) => {
          this.poolUser = poolUser;
          const formation = poolUser.getAssembleFormation();
          if (!formation) {
            this.form.controls.formation.setValue(undefined);
            return;
          }
          this.form.controls.formation.setValue(this.availableFormations.find(formationShell => {
            return formationShell.name === formation.getName();
          }));
          this.assembleLines = this.getAssembleLines(formation);
        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
    });
  }


  getAssembleLines(formation?: Formation): AssembleLine[] {
    const assembleLines: AssembleLine[] = [];
    if (!formation) {
      return assembleLines;
    }
    formation.getLines().forEach((formationLine: FormationLine) => {
      const players = formationLine.getPlayers().slice();
      const places: AssembleLinePlace[] = [];
      for (let i = 1; i <= formationLine.getMaxNrOfPersons(); i++) {
        const player = players.shift();
        places.push({
          lineNumber: formationLine.getNumber(),
          number: 1,
          player,
          substitute: false
        });
      }
      const substitute: AssembleLinePlace = {
        lineNumber: formationLine.getNumber(),
        number: 1,
        player: formationLine.getSubstitute(),
        substitute: true
      };
      assembleLines.push({
        number: formationLine.getNumber(), places, substitute
      });
    });
    return assembleLines;
  }

  selectPlace(place: AssembleLinePlace) {
    this.selectedPlace = place;
    this.selectedSearchLine = place.lineNumber;
    this.selectedTeamMap = this.getSelectedTeamMap();
  }

  getSelectedTeamMap(): TeamMap {
    const teamMap: TeamMap = new TeamMap();
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return teamMap;
    }
    formation.getLines().forEach((line: FormationLine) => {
      line.getPlayers().forEach((player: S11Player) => {
        const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player.getPerson());
        if (currentPlayer) {
          teamMap.set(+currentPlayer.getTeam().getId(), currentPlayer.getTeam());
        }
      });
    });
    return teamMap;
  }

  updatePlace(person: Person, smDown: boolean) {
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return;
    }
    const selectedPlace = this.selectedPlace;
    if (!selectedPlace) {
      return;
    }
    const line = formation.getLine(selectedPlace?.lineNumber);
    if (!line) {
      return;
    }
    this.updatingPlayer = true;
    this.removeSelected(line).subscribe(
        /* happy path */() => {
        const player = this.oneTeamSimultaneous.getCurrentPlayer(person);
        const team = player?.getTeam();
        this.removeSameTeam(formation, team).subscribe(
        /* happy path */() => {
            // check if someOne from same team is in formation, than show modal and 
            const viewPeriod = this.pool.getAssemblePeriod().getViewPeriod();
            this.formationRepository.addPerson(person, line, selectedPlace.substitute !== undefined).subscribe(
            /* happy path */() => {
                this.selectedPlace = undefined;
                this.assembleLines = this.getAssembleLines(formation);
                this.showSearchSMDown = false;
              },
                  /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; },
                  /* onComplete */() => this.updatingPlayer = false
            );
          },
        /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; }
        );
      },
        /* error path */(e: string) => { this.setAlert('danger', e); this.updatingPlayer = false; }
    );

  }

  protected removeSelected(line: FormationLine): Observable<void | number> {
    const selectedPlace = this.selectedPlace;
    if (!selectedPlace) {
      return of(0);
    }
    const player = selectedPlace.player;
    if (!player) {
      return of(0);
    }
    if (selectedPlace.substitute) {
      return this.formationRepository.removeSubstitute(player, line);
    }
    return this.formationRepository.removePlayer(player, line);
  }

  protected removeSameTeam(formation: Formation, team: Team | undefined): Observable<void | number> {
    if (!team) {
      return of(0);
    }
    // const selectedPlace = this.selectedPlace;
    // if (!selectedPlace) {
    //   return of(0);
    // }
    const player = formation.getPlayer(team);
    if (!player) {
      return of(0);
    }
    const currentPlayer = this.oneTeamSimultaneous.getCurrentPlayer(player.getPerson());
    if (!currentPlayer) {
      return of(0);
    }
    const line = formation.getLine(currentPlayer.getLine());
    if (!line) {
      return of(0);
    }
    const substitute = line.getSubstitute()
    if (substitute && substitute === player) {
      return this.formationRepository.removeSubstitute(substitute, line);
    }
    return this.formationRepository.removePlayer(player, line);
  }

  protected teamAlreadyPresent(team: Team): boolean {
    return this.poolUser.getAssembleFormation()?.getPlayer(team) !== undefined;
  }

  add(person: Person) {
    console.log('person selected: ' + person.getName());
  }

  processFormationChange(processing: boolean) {
    this.changingFormation = processing;
  }


  choosePerson(lineNumer: number) {
    console.log('TODO choosePerson for line ' + lineNumer);
  }

  removePerson(person: Person) {
    console.log('TODO removePerson');
  }

  substitute(assembleLine: AssembleLine) {

  }
}
