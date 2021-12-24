import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { concatMap } from 'rxjs/operators';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
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
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.scss']
})
export class FormationChooseComponent extends PoolComponent implements OnInit {
  public formations: Formation[] = [];
  public poolUser!: PoolUser;
  public currentFormation: Formation | undefined;

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
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.pool = pool;

          this.activeConfigRepository.getObject().pipe(
            concatMap((config: ActiveConfig) => {
              this.formations = config.getAvailableFormations();
              return this.poolUserRepository.getObjectFromSession(pool);
            })
          )
            .subscribe({
              next: (poolUser: PoolUser) => {
                this.poolUser = poolUser;
                const s11Formation = poolUser.getAssembleFormation();
                if (s11Formation !== undefined) {
                  this.currentFormation = s11Formation.getEqualFormation(this.formations);
                }
              },
              error: (e) => {
                this.setAlert('danger', e); this.processing = false;
              },
              complete: () => this.processing = false
            });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        }
      });
  }

  editFormation(newFormation: Formation) {
    this.formationRepository.editObject(this.poolUser, newFormation)
      .subscribe({
        next: (s11Formation: S11Formation) => {
          this.poolUser.setAssembleFormation(s11Formation);
          this.router.navigate(['/pool/formation/assemble', this.pool.getId()]);
        },
        error: (e) => {
          this.processing = false; this.setAlert('danger', e);
        },
        complete: () => this.processing = false
      });
  }
}

