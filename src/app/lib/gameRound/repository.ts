import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { CompetitionConfig } from '../competitionConfig';
import { ViewPeriod } from '../period/view';
import { JsonGameRound } from './json';
import { GameRoundMapper } from './mapper';
import { GameRound } from '../gameRound';

@Injectable({
    providedIn: 'root'
})
export class GameRoundRepository extends APIRepository {

    constructor(
        private mapper: GameRoundMapper, private http: HttpClient) {
        super();
    }

    getUrl(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): string {
        return this.getApiUrl() + 'competitionconfigs/' + competitionConfig.getSourceCompetition().getId() + '/viewperiods/' + viewPeriod.getId();
    }

    getFirstObjectNotFinished(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): Observable<GameRound | undefined> {
        const url = this.getUrl(competitionConfig, viewPeriod) + '/firstnotfinished';
        return this.http.get<JsonGameRound | undefined>(url, this.getOptions()).pipe(
            map((jsonGameRound: JsonGameRound | undefined) => {
                if (jsonGameRound === undefined) {
                    return undefined;
                }
                return this.mapper.toObject(jsonGameRound, viewPeriod);
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
