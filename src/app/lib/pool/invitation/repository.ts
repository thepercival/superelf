import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Pool } from '../../pool';
import { PoolInvitationMapper, JsonPoolInvitation } from './mapper';
import { PoolInvitation } from '../invitation';

@Injectable()
export class PoolInvitationRepository extends APIRepository {

    constructor(
        private http: HttpClient,
        private mapper: PoolInvitationMapper) {
        super();
    }

    getUrlpostfix(): string {
        return 'invitations';
    }


    getUrl(pool: Pool): string {
        return super.getApiUrl() + 'pools/' + pool.getId() + '/' + this.getUrlpostfix();
    }

    getObjects(pool: Pool): Observable<PoolInvitation[]> {
        return this.http.get(this.getUrl(pool), this.getOptions()).pipe(
            map((jsonInvitations: JsonPoolInvitation[]) => jsonInvitations.map(jsonInvitation => {
                return this.mapper.toObject(jsonInvitation, pool);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonPoolInvitation, pool: Pool): Observable<PoolInvitation> {
        return this.http.post(this.getUrl(pool), json, this.getOptions()).pipe(
            map((res: JsonPoolInvitation) => this.mapper.toObject(res, pool)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(invitation: PoolInvitation): Observable<PoolInvitation> {
        const pool = invitation.getPool();
        const url = this.getUrl(pool) + '/' + invitation.getId();
        return this.http.put(url, this.mapper.toJson(invitation), this.getOptions()).pipe(
            map((res: JsonPoolInvitation) => this.mapper.toObject(res, pool)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(invitation: PoolInvitation): Observable<JsonPoolInvitation> {
        const pool = invitation.getPool();
        const url = this.getUrl(pool) + '/' + invitation.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            map((res: JsonPoolInvitation) => res),
            catchError((err) => this.handleError(err))
        );
    }
}
