import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { Person, Team } from 'ngx-sport';
import { PersonRepository } from '../../lib/ngx-sport/person/repository';


@Component({
  selector: 'app-pool-chooseplayers',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  foundPersons: Person[] | undefined;
  teamFilter: Team | undefined;
  lineFilter: number | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected personRepository: PersonRepository,
    fb: FormBuilder
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      url: [{ value: '', disabled: true }, Validators.compose([
      ])],
    });
  }

  ngOnInit() {
    super.parentNgOnInit(() => {
      this.searchPersons();
    });
  }

  searchPersons() {
    if (!this.pool) {
      this.processing = false;
      return;
    }
    this.personRepository.getObjects(this.pool.getSourceCompetition(), this.teamFilter, this.lineFilter)
      .subscribe(
          /* happy path */(foundPersons: Person[]) => {
          this.foundPersons = foundPersons;

        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );


  }
}
