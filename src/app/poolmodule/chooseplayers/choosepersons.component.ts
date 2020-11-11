import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { Person, Player, Team } from 'ngx-sport';
import { PersonRepository } from '../../lib/ngx-sport/person/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';


@Component({
  selector: 'app-pool-chooseplayers',
  templateUrl: './choosepersons.component.html',
  styleUrls: ['./choosepersons.component.scss']
})
export class ChoosePersonsComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  foundPlayers: Player[] | undefined;
  teamFilter: Team | undefined;
  lineFilter: number | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected playerRepository: PlayerRepository,
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
    this.playerRepository.getObjects(this.pool.getSourceCompetition(), this.teamFilter, this.lineFilter)
      .subscribe(
          /* happy path */(foundPlayers: Player[]) => {
          this.foundPlayers = foundPlayers;

        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );
  }
}
