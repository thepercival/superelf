import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Competitor, Competition } from 'ngx-sport';
import { Pool } from '../../pool';
import { PoolCompetitorMapper } from '../../pool/competitor/mapper';
import { PoolCompetitor } from '../../pool/competitor';
import { User } from '../../user';
import { JsonPoolCompetitor } from '../../pool/competitor/json';


@Injectable()
export class CompetitorRepository extends APIRepository {

    constructor(
        private mapper: PoolCompetitorMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitors';
    }

    getUrl(pool: Pool): string {
        return super.getApiUrl() + 'pools/' + pool.getId() + '/' + this.getUrlpostfix();
    }

    // createObject(json: JsonPoolCompetitor, pool: Pool, competition: Competition, user: User): Observable<Competitor> {
    //     return this.http.post(this.getUrl(pool), json, this.getOptions()).pipe(
    //         map((jsonCompetitor: JsonPoolCompetitor) => this.mapper.toObject(jsonCompetitor, pool, competition, user)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // editObject(competitor: PoolCompetitor, pool: Pool): Observable<Competitor> {
    //     const url = this.getUrl(pool) + '/' + competitor.getId();
    //     return this.http.put(url, this.mapper.toJson(competitor), this.getOptions()).pipe(
    //         map((jsonCompetitor: JsonPoolCompetitor) => this.mapper.updateObject(jsonCompetitor, competitor)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // removeObject(competitor: Competitor, pool: Pool): Observable<void> {
    //     const url = this.getUrl(pool) + '/' + competitor.getId();
    //     return this.http.delete(url, this.getOptions()).pipe(
    //         map((jsonCompetitor: JsonPoolCompetitor) => {
    //             const index = pool.getCompetitors().indexOf(<PoolCompetitor>competitor);
    //             if (index > -1) {
    //                 pool.getCompetitors().splice(index, 1);
    //             }
    //         }),
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}
