import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Pool } from '../../pool';
import { GameRoundScoreMapper } from './mapper';
import { PoolInvitation } from '../invitation';

@Injectable()
export class GameRoundScoreRepository extends APIRepository {

    constructor(
        private http: HttpClient,
        private mapper: GameRoundScoreMapper) {
        super();
    }

    getUrlpostfix(): string {
        return 'gamerounds';
    }


    getUrl(pool: Pool): string {
        return super.getApiUrl() + 'pools/' + pool.getId() + '/' + this.getUrlpostfix();
    }

    // getObjects(viewPeriod: ViewPeriod, pool: Pool): Observable<PoolInvitation[]> {
    //     return this.http.get(this.getUrl(pool), this.getOptions()).pipe(
    //         map((jsonInvitations: JsonPoolInvitation[]) => jsonInvitations.map(jsonInvitation => {
    //             return this.mapper.toObject(jsonInvitation, pool);
    //         })),
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}
