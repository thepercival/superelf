import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Competition, PersonMapper } from 'ngx-sport';
import { ViewPeriod } from '../period/view';
import { S11Player, StatisticsMap } from '../player';
import { JsonStatistics } from './json';
import { StatisticsMapper } from './mapper';


@Injectable()
export class StatisticsRepository extends APIRepository {
    constructor(
        private mapper: StatisticsMapper,
        private http: HttpClient) {
        super();
    }

    getUrl(s11Player: S11Player): string {
        return super.getApiUrl() + 'players/' + s11Player.getId() + '/statistics';
    }

    getObjects(s11Player: S11Player): Observable<StatisticsMap> {
        return this.http.get<JsonStatistics[]>(this.getUrl(s11Player), this.getOptions()).pipe(
            map((jsonStatistics: JsonStatistics[]) => {
                const map = new StatisticsMap();
                jsonStatistics.forEach((jsonGameRoundStatistics: JsonStatistics) => {
                    map.set(
                        jsonGameRoundStatistics.gameRound.number,
                        this.mapper.toObject(jsonGameRoundStatistics));
                });
                return map;
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
