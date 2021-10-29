import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { concatMap, pairwise } from 'rxjs/operators';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { IAlert } from '../../shared/commonmodule/alert';
import { Formation } from 'ngx-sport';
import { S11Formation } from '../../lib/formation';
import { ActivatedRoute, Router } from '@angular/router';
import { PoolRepository } from '../../lib/pool/repository';
import { Pool } from '../../lib/pool';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { ActiveConfig } from '../../lib/activeConfig';
import { PoolUserRepository } from '../../lib/pool/user/repository';

@Component({
  selector: 'app-pool-chooseformation',
  templateUrl: './chooseformation.component.html',
  styleUrls: ['./chooseformation.component.scss']
})
export class ChooseFormationComponent extends PoolComponent implements OnInit {
  formations: Formation[] = [];
  poolUser!: PoolUser;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected formationRepository: FormationRepository,
    private modalService: NgbModal,
    protected activeConfigRepository: ActiveConfigRepository,
    protected poolUserRepository: PoolUserRepository,
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;

      this.activeConfigRepository.getObject().pipe(
        concatMap((config: ActiveConfig) => {
          this.formations = config.getAvailableFormations();
          console.log(this.formations);
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      ).subscribe(
        /* happy path */(poolUser: PoolUser) => {
          this.poolUser = poolUser;
          const s11Formation = poolUser.getAssembleFormation();
          if (!s11Formation) {
            /*
                const assembleFormation = this.poolUser.getAssembleFormation();
    if (!assembleFormation) {
      this.form.controls.formation.setValue(undefined);
      return;
    }

    this.form.controls.formation.setValue(this.availableFormations.find((formation: Formation) => {
      return formation.getName() === assembleFormation.getName();
    }));
    */
          }
          // this.form.controls.formation.setValue(this.availableFormations.find(formation => {
          //   return s11Formation.getName() === formation.getName();
          // }));
          // this.assembleLines = this.getAssembleLines(formation);
        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
    }, /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; });
  }

  editFormation(newFormation: Formation) {
    this.formationRepository.editObject(this.poolUser, newFormation).subscribe(
      /* happy path */(s11Formation: S11Formation) => {
        this.poolUser.setAssembleFormation(s11Formation);
        this.router.navigate(['/pool/assemble', this.pool.getId()]);
      },
      /* error path */(e: string) => { this.processing = false; this.setAlert('danger', e); },
      /* onComplete */() => this.processing = false
    );
  }
}

