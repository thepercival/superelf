import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, Person, PersonMap, Player } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { ActiveConfig } from '../../lib/pool/activeConfig';
import { JsonFormationShell } from '../../lib/activeConfig/json';
import { concatMap, pairwise } from 'rxjs/operators';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { Formation } from '../../lib/formation';
import { FormationLineMapper } from '../../lib/formation/line/mapper';
import { FormationLine } from '../../lib/formation/line';
import { SuperElfNameService } from '../../lib/nameservice';
import { FormationRepository } from '../../lib/formation/repository';


@Component({
  selector: 'app-pool-assembleteam',
  templateUrl: './assemble.component.html',
  styleUrls: ['./assemble.component.scss']
})
export class AssembleComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  availableFormations: JsonFormationShell[] = [];
  poolUser: PoolUser | undefined;
  nameService = new NameService();
  superElfNameService = new SuperElfNameService();
  assembleLines: AssembleLine[] = [];
  showSearchBtn = false;
  showSearchOnSM: boolean = false;
  teamPersonMap = new PersonMap();

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
          this.changeAssembleLines(formation);
        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );

      // this.setScountingList(pool);
      // this.searchPersons(pool);
    });
  }


  changeAssembleLines(formation?: Formation) {
    this.assembleLines = [];
    if (!formation) {
      return;
    }
    formation.getLines().forEach((formationLine: FormationLine) => {
      const persons = formationLine.getPersons().slice();
      const assemblePlayers: (Player | undefined)[] = [];
      for (let i = 1; i <= formationLine.getMaxNrOfPersons(); i++) {
        const person = persons.shift();
        assemblePlayers.push(person ? person.getPlayer() : undefined);
      }
      const substitute = formationLine.getSubstitute()?.getPlayer();
      const assembleLine: AssembleLine = {
        number: formationLine.getNumber(),
        players: assemblePlayers,
        substitute
      };
      this.assembleLines.push(assembleLine);
    });
    console.log(this.assembleLines);
  }

  add(person: Person) {

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

interface AssembleLine {
  number: number;
  players: (Player | undefined)[];
  substitute: Player | undefined;
}