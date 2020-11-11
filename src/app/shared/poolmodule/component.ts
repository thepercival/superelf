import { ActivatedRoute, Router } from '@angular/router';
import { Structure, StructureService } from 'ngx-sport';

import { IAlert } from '../commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';

export class PoolComponent {

    public pool: Pool | undefined;
    public structure: Structure | undefined;
    public alert: IAlert | undefined;
    public processing = true;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected poolRepository: PoolRepository
    ) {
    }

    protected parentNgOnInit(callback?: DataProcessCallBack) {
        this.route.params.subscribe(params => {
            this.setPool(+params['id'], callback);
        });
    }

    protected setPool(poolId: number, callback?: DataProcessCallBack) {
        this.poolRepository.getObject(poolId)
            .subscribe(
                /* happy path */(pool: Pool) => {
                    console.log(pool);
                    this.pool = pool;
                    if (callback !== undefined) {
                        callback();
                    }
                    return;

                },
                /* error path */(e: string) => {
                    this.setAlert('danger', e); this.processing = false;
                },
                /* onComplete */() => { }
            );
    }

    protected setAlert(type: string, message: string) {
        this.alert = { 'type': type, 'message': message };
    }

    protected resetAlert(): void {
        this.alert = undefined;
    }

    protected getStructureService(): StructureService {
        return new StructureService(Pool.PlaceRanges);
    }
}

type DataProcessCallBack = () => void;
