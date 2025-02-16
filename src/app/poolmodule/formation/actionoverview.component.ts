import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { FootballLine, Formation, NameService, Player } from 'ngx-sport';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { Replacement } from '../../lib/editAction/replacement';
import { Transfer } from '../../lib/editAction/transfer';
import { Substitution } from '../../lib/editAction/substitution';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { S11Formation } from '../../lib/formation';
import { TransferPeriodActionList } from '../../lib/editAction';
import { FormationRepository } from '../../lib/formation/repository';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamNameComponent } from '../team/name.component';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';

@Component({
  selector: "app-pool-actionoverview",
  standalone: true,
  imports: [FontAwesomeModule,NgbAlertModule,TeamNameComponent,LineIconComponent],
  templateUrl: "./actionoverview.component.html",
  styleUrls: ["./actionoverview.component.scss"],
})
export class FormationActionOverviewComponent
  extends PoolComponent
  implements OnInit
{
  poolUser!: PoolUser;
  list!: TransferPeriodActionList;
  nameService = new NameService();
  replacements: Replacement[] | undefined;
  transfers: Transfer[] | undefined;
  substitutions: Substitution[] | undefined;
  public calcFormation: S11Formation | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.route.params.subscribe((params) => {
          this.poolUserRepository
            .getObject(pool, +params.poolUserId)
            .subscribe({
              next: (poolUser: PoolUser) => {
                this.poolUser = poolUser;
                this.list = poolUser.getTransferPeriodActionList();
                this.formationRepository
                  .getObject(poolUser, pool.getAssembleViewPeriod())
                  .subscribe({
                    next: (assembleFormation: S11Formation) => {
                      const calculator = new S11FormationCalculator();
                      this.calcFormation = calculator.getCurrentFormation(
                        assembleFormation,
                        this.list
                      );
                    },
                    error: (e: string) => {
                      this.setAlert("danger", e);
                      this.processing.set(false);
                    },
                    complete: () => (this.processing.set(false)),
                  });
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
              complete: () => (this.processing.set(false)),
            });
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  getPlayerIn(calcFormation: S11Formation, substitution: Substitution): Player {
    return this.getPlayer(calcFormation, substitution.getLineNumberOut());
  }

  getPlayerOut(
    calcFormation: S11Formation,
    substitution: Substitution
  ): Player {
    return this.getPlayer(
      calcFormation,
      substitution.getLineNumberOut(),
      substitution.getPlaceNumberOut()
    );
  }

  private getPlayer(
    calcFormation: S11Formation,
    lineNumber: FootballLine,
    placeNumber?: number | undefined
  ): Player {
    const formationLine = calcFormation.getLine(lineNumber);
    let place = formationLine.getSubstitute();
    if (placeNumber !== undefined) {
      place = formationLine.getPlace(placeNumber);
    }
    const player = place.getPlayer()?.getMostRecentPlayer();
    if (player === undefined) {
      throw new Error("no player found");
    }
    return player;
  }

  inTransfer(pool: Pool): boolean {
    return pool.getTransferPeriod().isIn();
  }

  inAfterTransfer(pool: Pool): boolean {
    return (
      pool.getTransferPeriod().getEndDateTime().getTime() <
      new Date().getTime()
    );
  }
}