import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ScoutedPersonRepository } from '../../lib/scoutedPerson/repository';
import { ScoutedPerson } from '../../lib/scoutedPerson';
import { Pool } from '../../lib/pool';
import { Person } from 'ngx-sport';


@Component({
  selector: 'app-pool-scouting',
  templateUrl: './scouting.component.html',
  styleUrls: ['./scouting.component.scss']
})
export class ScoutingComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  scoutedPersons: ScoutedPerson[] = [];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected scoutedPersonRepository: ScoutedPersonRepository,
    fb: FormBuilder
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
      this.initScoutedPersons(pool);
    });
  }

  initScoutedPersons(pool: Pool) {
    this.scoutedPersonRepository.getObjects(pool.getSourceCompetition())
      .subscribe(
          /* happy path */(scoutedPersons: ScoutedPerson[]) => {
          this.scoutedPersons = scoutedPersons;

        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );


  }

  copyToTeam(person: Person) {

  }
}
