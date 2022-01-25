import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper, Formation, FormationMapper, JsonFormation } from 'ngx-sport';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { CompetitionConfig } from '../competitionConfig';

import { Pool } from '../pool';
import { APIRepository } from '../repository';
import { JsonCompetitionConfig } from './json';
import { CompetitionConfigMapper } from './mapper';


@Injectable({
    providedIn: 'root'
})
export class CompetitionConfigRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: CompetitionConfigMapper,
        private formationMapper: FormationMapper) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pools';
    }

    getUrl(pool?: Pool): string {
        return this.url + (pool ? ('/' + pool.getId()) : '');
    }

    getActiveObjects(): Observable<CompetitionConfig[]> {
        const url = this.getUrl() + '/active';
        return this.http.get<JsonCompetitionConfig[]>(url, { headers: super.getHeaders() }).pipe(
            map((jsonConfigs: JsonCompetitionConfig[]) => {
                return jsonConfigs.map((jsonConfig) => this.mapper.toObject(jsonConfig));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getAvailableFormations(competitionConfig: CompetitionConfig): Observable<Formation[]> {
        const url = this.getUrl() + '/' + competitionConfig.getId() + '/availableformations';
        return this.http.get<JsonFormation[]>(url, { headers: super.getHeaders() }).pipe(
            map((jsonFormations: JsonFormation[]) => {
                return jsonFormations.map((jsonFormation) => this.formationMapper.toObject(jsonFormation));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    // getObjectHelper(jsonPool: JsonCompetitionConfig, obsCompetition: Observable<Competition>): Observable<Pool> {
    //     return obsCompetition.pipe(
    //         map((sourceCompetition: Competition) => this.mapper.toObject(jsonPool, sourceCompetition))
    //     );
    // }

    // getObject(id: number): Observable<Pool> {
    //     const url = super.getApiUrl() + (this.getToken() === undefined ? 'public/' : '') + this.getUrlpostfix() + '/' + id;
    //     return this.http.get<JsonPool>(url, { headers: super.getHeaders() }).pipe(
    //         concatMap((jsonPool: JsonPool) => {
    //             return this.getObjectHelper(jsonPool, this.competitionRepository.getObject(jsonPool.sourceCompetitionId));
    //         }),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // getObjectHelper(jsonPool: JsonPool, obsCompetition: Observable<Competition>): Observable<Pool> {
    //     return obsCompetition.pipe(
    //         map((sourceCompetition: Competition) => this.mapper.toObject(jsonPool, sourceCompetition))
    //     );
    // }
}

