import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { FootballLine, NameService, Player } from 'ngx-sport';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { Replacement } from '../../lib/editAction/replacement';
import { Transfer } from '../../lib/editAction/transfer';
import { Substitution } from '../../lib/editAction/substitution';
import { S11FormationCalculator } from '../../lib/formation/calculator';
import { S11Formation } from '../../lib/formation';

@Component({
  selector: 'app-pool-actionoverview',
  templateUrl: './actionoverview.component.html',
  styleUrls: ['./actionoverview.component.scss']
})
export class FormationActionOverviewComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  nameService = new NameService();
  replacements: Replacement[]|undefined;
  transfers: Transfer[]|undefined;
  substitutions: Substitution[]|undefined;
  public calcFormation: S11Formation|undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit()
      .subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);
          this.poolUserRepository.getObjectFromSession(pool).subscribe({
            next: ((poolUser: PoolUser) => {
              this.poolUser = poolUser;
              this.replacements = poolUser.getReplacements();
              this.transfers = poolUser.getTransfers();
              this.substitutions = poolUser.getSubstitutions();
              const calculator = new S11FormationCalculator();                
              this.calcFormation = calculator.getCurrentFormation(poolUser);
            }),
            error: (e: string) => {
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

  getPlayerIn(substitution: Substitution): Player {
    return this.getPlayer(substitution.getLineNumberOut());
  }

  getPlayerOut(substitution: Substitution): Player {
    return this.getPlayer(substitution.getLineNumberOut(), substitution.getPlaceNumberOut());
  }

  private getPlayer(lineNumber: FootballLine, placeNumber?: number|undefined): Player {
    const calcFormation = this.calcFormation;
    if( calcFormation === undefined ) {
      throw new Error('no formation found');
    }
    const formationLine = calcFormation.getLine(lineNumber);
    let place = formationLine.getSubstitute();
    if( placeNumber !== undefined) {
      place = formationLine.getPlace(placeNumber);
    }
    const player = place.getPlayer()?.getMostRecentPlayer();
    if( player === undefined ) {
      throw new Error('no player found');
    }
    return player;
  }

  inTransfer(): boolean {
    return this.pool.getTransferPeriod().isIn();
  }

  inAfterTransfer(): boolean {
    return this.pool.getTransferPeriod().getEndDateTime().getTime() < (new Date()).getTime();
  }
}