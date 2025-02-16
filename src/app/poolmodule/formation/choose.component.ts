import { Component, OnInit } from '@angular/core';

import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitleComponent } from '../../shared/commonmodule/title/title.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { NgIf } from '@angular/common';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-pool-chooseformation",
  standalone: true,
  imports: [
    NgbAlertModule,
    FontAwesomeModule,
    TitleComponent,
    LineIconComponent,
    NgIf,
  ],
  templateUrl: "./choose.component.html",
  styleUrls: ["./choose.component.scss"],
})
export class FormationChooseComponent extends PoolComponent implements OnInit {
  public formations: Formation[] = [];
  public poolUser!: PoolUser;
  public currentFormation: Formation | undefined;
  public faCheckCircle = faCheckCircle;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected formationRepository: FormationRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    private modalService: NgbModal,
    protected poolUserRepository: PoolUserRepository
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);

        this.competitionConfigRepository
          .getAvailableFormations(pool.getCompetitionConfig())
          .pipe(
            concatMap((formations: Formation[]) => {
              this.formations = formations;
              return this.poolUserRepository.getObjectFromSession(pool);
            })
          )
          .subscribe({
            next: (poolUser: PoolUser) => {
              this.poolUser = poolUser;
              if (poolUser.hasAssembleFormation()) {
                this.formationRepository
                  .getObject(poolUser, pool.getAssembleViewPeriod())
                  .subscribe({
                    next: (assembleFormation: S11Formation) => {
                      this.currentFormation =
                        assembleFormation.getEqualFormation(this.formations);
                      this.processing.set(false);
                    },
                    error: (e) => {
                      this.setAlert("danger", e);
                      this.processing.set(false);
                    },
                  });
              } else {
                this.processing.set(false);
              }
            },
            error: (e) => {
              this.setAlert("danger", e);
              this.processing.set(false);
            },
            complete: () => this.processing.set(false),
          });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  editFormation(pool: Pool, newFormation: Formation) {
    this.formationRepository.editObject(this.poolUser, newFormation).subscribe({
      next: () => {
        this.router.navigate(["/pool/formation/assemble", pool.getId()]);
      },
      error: (e) => {
        this.processing.set(false);
        this.setAlert("danger", e);
      },
      complete: () => this.processing.set(false),
    });
  }
}

