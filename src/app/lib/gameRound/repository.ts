import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { CompetitionConfig } from '../competitionConfig';
import { ViewPeriod } from '../period/view';
import { GameRoundMapper } from './mapper';

@Injectable({
    providedIn: 'root'
})
export class GameRoundRepository extends APIRepository {

    constructor(
        private mapper: GameRoundMapper, private http: HttpClient) {
        super();
    }

    getUrl(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): string {
        return this.getApiUrl() + 'public/competitionconfigs/' + competitionConfig.getId() + '/viewperiods/' + viewPeriod.getId();
    }

    getCurrentNumbers(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): Observable<CurrentGameRoundNumbers> {
        const url = this.getUrl(competitionConfig, viewPeriod) + '/fetchcustom';
        return this.http.get<CurrentGameRoundNumbers>(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }
}

export interface CurrentGameRoundNumbers {
    firstCreatedOrInProgress: number | undefined,
    lastFinishedOrInPorgress: number | undefined
}