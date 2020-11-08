import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Pool } from '../../pool';
import { PoolUser } from '../user';

@Injectable()
export class PoolUserRepository extends APIRepository {

    constructor(
        private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'users';
    }


    getUrl(pool: Pool): string {
        return super.getApiUrl() + 'pools/' + pool.getId() + '/' + this.getUrlpostfix();
    }

    removeObject(poolUser: PoolUser): Observable<void> {
        const pool = poolUser.getPool();
        const url = this.getUrl(pool) + '/' + poolUser.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            map(() => {
                const index = pool.getUsers().indexOf(poolUser);
                if (index > -1) {
                    pool.getUsers().splice(index, 1);
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
