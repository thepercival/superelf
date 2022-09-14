import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { S11Player, StatisticsMap } from '../player';
import { JsonStatistics } from './json';
import { StatisticsMapper } from './mapper';
import { Formation } from 'ngx-sport';
import { GameRound } from '../gameRound';
import { S11Formation } from '../formation';

@Injectable({
    providedIn: 'root'
})
export class StatisticsRepository extends APIRepository {
    constructor(
        private mapper: StatisticsMapper,
        private http: HttpClient) {
        super();
    }

    getPlayerUrl(s11Player: S11Player): string {
        return super.getApiUrl() + 'players/' + s11Player.getId() + '/statistics';
    }

    getFormationUrl(formation: S11Formation, gameRound: GameRound): string {
        return super.getApiUrl() + 'formation/' + formation.getId() + '/statistics/' + gameRound.getNumber();
    }

    setPlayerObjects(s11Player: S11Player): Observable<StatisticsMap> {
        return this.http.get<JsonStatistics[]>(this.getPlayerUrl(s11Player), this.getOptions()).pipe(
            map((jsonStatistics: JsonStatistics[]) => {
                const map = new StatisticsMap();
                jsonStatistics.forEach((jsonGameRoundStatistics: JsonStatistics) => {
                    map.set(
                        jsonGameRoundStatistics.gameRound.number,
                        this.mapper.toObject(jsonGameRoundStatistics));
                });
                s11Player.setStatistics(map);
                return map;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    setFormationObjects(formation: S11Formation, gameRound: GameRound): Observable<StatisticsMap> {
        return this.http.get<JsonStatistics[]>(this.getFormationUrl(formation, gameRound), this.getOptions()).pipe(
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
