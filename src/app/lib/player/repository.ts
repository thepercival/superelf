import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Competition, PersonMapper, Team } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIRepository } from '../repository';

import { ViewPeriod } from '../period/view';
import { S11PlayerMapper } from './mapper';
import { JsonS11Player } from './json';
import { S11Player } from '../player';

@Injectable({
    providedIn: 'root'
})
export class S11PlayerRepository extends APIRepository {
    constructor(
        private mapper: S11PlayerMapper, private personMapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'players';
    }

    getUrl(): string {
        return super.getApiUrl() + this.getUrlpostfix();
    }

    getObjects(competiton: Competition, viewPeriod: ViewPeriod, team?: Team, line?: number): Observable<S11Player[]> {
        const jsonFilter = {
            viewPeriodId: viewPeriod.getId(),
            teamId: team?.getId(),
            line: line
        };
        return this.http.post<JsonS11Player[]>(this.getUrl(), jsonFilter, this.getOptions()).pipe(
            map((jsonPlayers: JsonS11Player[]) => jsonPlayers.map(jsonPlayer => {
                return this.mapper.toObject(jsonPlayer, competiton, viewPeriod);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
