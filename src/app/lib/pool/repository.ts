import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CompetitionConfig } from '../competitionConfig';
import { CompetitionConfigMapper } from '../competitionConfig/mapper';

import { Pool } from '../pool';
import { APIRepository } from '../repository';
import { JsonPool } from './json';
import { PoolMapper } from './mapper';


@Injectable({
    providedIn: 'root'
})
export class PoolRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: PoolMapper,
        private competitionConfigMapper: CompetitionConfigMapper) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pools';
    }

    getUrl(pool?: Pool): string {
        return this.url + (pool ? ('/' + pool.getId()) : '');
    }

    getObject(id: number): Observable<Pool> {
        const url = super.getApiUrl() + (this.getToken() === undefined ? 'public/' : '') + this.getUrlpostfix() + '/' + id;
        
        return this.http.get<JsonPool>(url, { headers: super.getHeaders() }).pipe(
            map((jsonPool: JsonPool) => {
                console.log(jsonPool);
                const t = this.mapper.toObject(jsonPool);
                console.log(t);
                return t;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getWorldCupId(seasonId: number): Observable<number> {
        const url = super.getApiUrl() + 'public/pools/worldcupid/' + seasonId;
        return this.http.get(url, { headers: this.getBaseHeaders(), responseType: 'text' }).pipe(
            catchError((err: HttpErrorResponse) => this.handleError(err))
        );
    }

    // getObjectHelper(jsonPool: JsonPool, obsCompetition: Observable<Competition>): Observable<Pool> {
    //     return obsCompetition.pipe(
    //         map((sourceCompetition: Competition) => this.mapper.toObject(jsonPool, sourceCompetition))
    //     );
    // }

    createObject(name: string, competitionConfig: CompetitionConfig): Observable<Pool> {
        const json = { name, competitionConfigId: competitionConfig.getId() };
        return this.http.post<JsonPool>(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonPool: JsonPool) => this.mapper.toObject(jsonPool)),
            catchError((err) => this.handleError(err))
        );
    }



    getJoinUrl(pool: Pool): Observable<string> {
        const baseUrl = super.getApiUrl() + this.getUrlpostfix() + '/' + pool.getId();
        return this.http.get(baseUrl + '/joinurl', { headers: super.getHeaders() }).pipe(
            map((json: any) => json.url),
            catchError((err) => this.handleError(err))
        );
    }

    join(pool: Pool, key: string): Observable<void> {
        const baseUrl = super.getApiUrl() + this.getUrlpostfix() + '/' + pool.getId();
        return this.http.post(baseUrl + '/join', { key }, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }
}




