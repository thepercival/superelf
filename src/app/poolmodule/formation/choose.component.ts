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
import { PoolComponent } from '../../shared/poolmodule/component';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { CompetitionConfigRepository } from '../../lib/competitionConfig/repository';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';

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
    globalEventsManager: GlobalEventsManager,
    protected formationRepository: FormationRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    private modalService: NgbModal,
    protected poolUserRepository: PoolUserRepository,
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);

          this.competitionConfigRepository.getAvailableFormations(pool.getCompetitionConfig()).pipe(
            concatMap((formations: Formation[]) => {
              this.formations = formations;
              return this.poolUserRepository.getObjectFromSession(pool);
            })
          )
          .subscribe({
            next: (poolUser: PoolUser) => {
              this.poolUser = poolUser;
              if( poolUser.hasAssembleFormation() ) {
                this.formationRepository.getObject(poolUser, pool.getAssembleViewPeriod()).subscribe({
                  next: (assembleFormation: S11Formation) => {
                    this.currentFormation = assembleFormation.getEqualFormation(this.formations);
                    this.processing = false;
                  },
                  error: (e) => {
                    this.setAlert('danger', e); this.processing = false;
                  }
                });
              } else {
                this.processing = false;
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
        next: () => {
          this.router.navigate(['/pool/formation/assemble', this.pool.getId()]);
        },
        error: (e) => {
          this.processing = false; this.setAlert('danger', e);
        },
        complete: () => this.processing = false
      });
  }
}

