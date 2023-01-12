import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Pool } from '../../pool';
import { PoolUser } from '../user';
import { AuthService } from '../../auth/auth.service';
import { JsonPoolUser } from './json';
import { PoolUserMapper } from './mapper';

@Injectable({
    providedIn: 'root'
})
export class PoolUserRepository extends APIRepository {

    constructor(
        private mapper: PoolUserMapper,
        private http: HttpClient,
        private authService: AuthService,) {
        super();
    }

    getUrlpostfix(): string {
        return 'users';
    }

    getUrl(pool: Pool, publicX?: boolean): string {
        return super.getApiUrl() + (publicX ? 'public/' : '') + 'pools/' + pool.getId() + '/' + this.getUrlpostfix();
    }

    getObject(pool: Pool, poolUserId: number): Observable<PoolUser> {
        const user = this.authService.getUser();
        return this.http.get<JsonPoolUser>(this.getUrl(pool, true) + '/' + poolUserId, this.getOptions()).pipe(
            map((jsonPoolUser: JsonPoolUser) => this.mapper.toObject(jsonPoolUser, pool)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjectFromSession(pool: Pool): Observable<PoolUser> {
        const user = this.authService.getUser();
        return this.http.get<JsonPoolUser>(this.getUrl(pool) + '/session', this.getOptions()).pipe(
            map((jsonPoolUser: JsonPoolUser) => this.mapper.toObject(jsonPoolUser, pool)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(pool: Pool): Observable<PoolUser[]> {
        return this.http.get<JsonPoolUser[]>(this.getUrl(pool), this.getOptions()).pipe(
            map((jsonPoolUsers: JsonPoolUser[]) => jsonPoolUsers.map(jsonPoolUser => {
                return this.mapper.toObject(jsonPoolUser, pool);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(poolUser: PoolUser): Observable<void> {
        const pool = poolUser.getPool();
        const url = this.getUrl(pool) + '/' + poolUser.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }
}
