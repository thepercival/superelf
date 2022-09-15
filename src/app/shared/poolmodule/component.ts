import { ActivatedRoute, Router } from '@angular/router';

import { IAlert } from '../commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { PoolUser } from '../../lib/pool/user';
import { GlobalEventsManager } from '../commonmodule/eventmanager';
import { Competition, Structure } from 'ngx-sport';
import { AssemblePeriod } from '../../lib/period/assemble';
import { TransferPeriod } from '../../lib/period/transfer';

export class PoolComponent {

    public pool!: Pool;
    public poolUser: PoolUser | undefined;
    public alert: IAlert | undefined;
    public processing = true;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected poolRepository: PoolRepository,
        protected globalEventsManager: GlobalEventsManager
    ) {
    }

    protected parentNgOnInit(): Observable<Pool> {
        return this.route.params.pipe(
            concatMap(params => {
                return this.poolRepository.getObject(+params['id']);
            }),
        );
    }

    protected setAlert(type: string, message: string) {
        this.alert = { 'type': type, 'message': message };
    }

    protected resetAlert(): void {
        this.alert = undefined;
    }

    protected setPool(pool: Pool): void {
        this.pool = pool;
        this.globalEventsManager.navHeaderInfo.emit({
            id: +pool.getId(),
            name: pool.getName(),
            start: pool.getSeason().getStartDateTime()
        });
        // this.globalEventsManager.showFooter.emit(false);
    }

    protected getCurrentEditPeriod(pool: Pool): AssemblePeriod | TransferPeriod | undefined {
        const date = new Date();
        if (date.getTime() > pool.getTransferPeriod().getStartDateTime().getTime()) {
            return pool.getTransferPeriod();
        }
        if (date.getTime() > pool.getAssemblePeriod().getStartDateTime().getTime()) {
            return pool.getAssemblePeriod();
        }
        return undefined;
    }
}
