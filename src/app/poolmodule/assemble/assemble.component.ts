import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, TeamMap, SportCustom, Team, Player } from 'ngx-sport';
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
  showSearchOnSM: boolean = false;
  teamPersonMap = new PersonMap();
  selectedPlace: AssembleLinePlace | undefined;
  changingFormation = false;
  selectedSearchLine: number = SportCustom.Football_Line_All;
  selectedTeamMap: TeamMap = new TeamMap();

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

      // this.setScountingList(pool);
      // this.searchPersons(pool);
    });
  }


  getAssembleLines(formation?: Formation): AssembleLine[] {
    const assembleLines: AssembleLine[] = [];
    if (!formation) {
      return assembleLines;
    }
    formation.getLines().forEach((formationLine: FormationLine) => {
      const persons = formationLine.getPersons().slice();
      const places: AssembleLinePlace[] = [];
      for (let i = 1; i <= formationLine.getMaxNrOfPersons(); i++) {
        const person = persons.shift();
        places.push({
          lineNumber: formationLine.getNumber(),
          number: 1,
          player: person ? person.getPlayerOneTeamSim() : undefined,
          isSubstitute: false
        });
      }
      const lineSubstitute = formationLine.getSubstitute();
      const substitute = {
        lineNumber: formationLine.getNumber(),
        number: 1,
        player: lineSubstitute ? lineSubstitute.getPlayerOneTeamSim() : undefined,
        isSubstitute: true
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

    console.log('searching for line ' + this.selectedPlace.lineNumber + ', place ' + this.selectedPlace.number);
  }

  getSelectedTeamMap(): TeamMap {
    const teamMap: TeamMap = new TeamMap();
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return teamMap;
    }
    formation.getLines().forEach((line: FormationLine) => {
      line.getPersons().forEach((person: Person) => {
        const player = person.getPlayerOneTeamSim();
        if (player) {
          teamMap.set(+player.getTeam().getId(), player.getTeam());
        }
      });
    });
    return teamMap;
  }

  updatePlace(player: Player) {
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
    this.removePersonSameTeam(line).subscribe(
        /* happy path */() => {
        this.formationRepository.addPerson(player, line, selectedPlace.isSubstitute).subscribe(
        /* happy path */() => {

            this.assembleLines = this.getAssembleLines(formation);
          },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
        );
      },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; }
    );
    console.log('update line ' + selectedPlace.lineNumber + ', place ' + selectedPlace.number
      + ' with person ' + player.getPerson().getName());
  }

  protected removePersonSameTeam(line: FormationLine): Observable<void | number> {
    const selectedPlace = this.selectedPlace;
    if (!selectedPlace) {
      return of(0);
    }
    const player = this.selectedPlace?.player;
    if (!player || !this.teamAlreadyPresent(player.getTeam())) {
      return of(0);
    }
    return this.formationRepository.removePerson(player, line, selectedPlace.isSubstitute);
  }

  protected teamAlreadyPresent(team: Team): boolean {
    return this.poolUser.getAssembleFormation()?.getPerson(team) !== undefined;
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
