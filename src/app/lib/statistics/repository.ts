import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { S11Player, StatisticsMap } from '../player';
import { JsonStatistics } from './json';
import { StatisticsMapper } from './mapper';
import { GameRound } from '../gameRound';
import { S11Formation } from '../formation';
import { S11FormationLine } from '../formation/line';
import { S11FormationPlace } from '../formation/place';

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

    getFormationRequests(formation: S11Formation): Observable<StatisticsMap>[] {
        const setStatistics: Observable<StatisticsMap>[] = [];

        formation.getLines().forEach((line: S11FormationLine) => {
            line.getPlaces().forEach((formationPlace: S11FormationPlace) => {
                const s11Player = formationPlace.getPlayer();
                if (s11Player === undefined || s11Player.hasStatistics()) {
                    return;
                }
                setStatistics.push(this.setPlayerObjects(s11Player));
            });
        });
        return setStatistics;
    }
}
