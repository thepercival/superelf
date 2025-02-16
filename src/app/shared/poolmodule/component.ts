import { ActivatedRoute, Router } from '@angular/router';

import { IAlert } from '../commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../commonmodule/eventmanager';
import { AssemblePeriod } from '../../lib/period/assemble';
import { TransferPeriod } from '../../lib/period/transfer';
import { ViewPeriod } from '../../lib/period/view';
import { signal, WritableSignal } from '@angular/core';

export class PoolComponent {
  public pool: Pool | undefined;
  public currentViewPeriod: ViewPeriod | undefined;
  public poolUserFromSession: PoolUser | undefined;
  public poolUserFromId: PoolUser | undefined;
  public alert: IAlert | undefined;
  public processing: WritableSignal<boolean> = signal(true);

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected poolRepository: PoolRepository,
    protected globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.showFooter.emit(false);
    // console.log('new pool component');
  }

  protected parentNgOnInit(): Observable<Pool> {
    return this.route.params.pipe(
      concatMap((params) => {
        return this.poolRepository.getObject(+params["id"]);
      })
    );
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type: type, message: message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  protected setPool(pool: Pool): void {
    this.pool = pool;
    this.currentViewPeriod = this.getCurrentViewPeriod(pool);
    this.globalEventsManager.navHeaderInfo.emit({
      id: +pool.getId(),
      name: pool.getName(),
      start: pool.getSeason().getStartDateTime(),
    });
    // this.globalEventsManager.showFooter.emit(false);
  }

  public getCurrentViewPeriod(pool: Pool, date?: Date): ViewPeriod {
    if (date === undefined) {
      date = new Date();
    }
    if (date.getTime() > pool.getTransferPeriod().getEndDateTime().getTime()) {
      return pool.getTransferPeriod().getViewPeriod();
    }
    if (date.getTime() > pool.getAssemblePeriod().getEndDateTime().getTime()) {
      return pool.getAssemblePeriod().getViewPeriod();
    }
    return pool.getCreateAndJoinPeriod();
  }

  // protected getMostRecentStartedEditPeriod(pool: Pool): AssemblePeriod | TransferPeriod | undefined {
  //     const date = new Date();
  //     if (date.getTime() > pool.getTransferPeriod().getStartDateTime().getTime()) {
  //         return pool.getTransferPeriod();
  //     }
  //     if (date.getTime() > pool.getAssemblePeriod().getStartDateTime().getTime()) {
  //         return pool.getAssemblePeriod();
  //     }
  //     return undefined;
  // }

  protected getMostRecentEndedEditPeriod(
    pool: Pool
  ): AssemblePeriod | TransferPeriod | undefined {
    const date = new Date();
    if (date.getTime() > pool.getTransferPeriod().getEndDateTime().getTime()) {
      return pool.getTransferPeriod();
    }
    if (date.getTime() > pool.getAssemblePeriod().getEndDateTime().getTime()) {
      return pool.getAssemblePeriod();
    }
    return undefined;
  }
}
