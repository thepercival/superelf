import { ActivatedRoute, Router } from '@angular/router';
import { Structure, StructureService } from 'ngx-sport';

import { IAlert } from '../commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

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

    protected getStructureService(): StructureService {
        return new StructureService(Pool.PlaceRanges);
    }
}

type DataProcessCallBack = () => void;
