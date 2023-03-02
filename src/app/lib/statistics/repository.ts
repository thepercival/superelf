import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { S11Player } from '../player';
import { JsonStatistics } from './json';
import { StatisticsMapper } from './mapper';
import { GameRound } from '../gameRound';
import { S11Formation } from '../formation';
import { StatisticsGetter } from './getter';

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
        return super.getApiUrl() + 'formations/' + formation.getId() + '/statistics/' + gameRound.getNumber();
    }


    // gebruik deze repos als cache!!

    getGameRoundObjects(formation: S11Formation, gameRound: GameRound, getter: StatisticsGetter): Observable<void> {
        return this.http.get<JsonStatistics[]>(this.getFormationUrl(formation, gameRound), this.getOptions()).pipe(
            map((jsonStatistics: JsonStatistics[]) => {
                jsonStatistics.forEach((jsonStatistics: JsonStatistics) => {
                    const personId = jsonStatistics.person?.id;
                    if( personId !== undefined ) {
                        getter.addStatistics(gameRound, personId, this.mapper.toObject(jsonStatistics));
                    }
                });
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getPlayerObjects(s11Player: S11Player, getter: StatisticsGetter): Observable<void> {
        return this.http.get<JsonStatistics[]>(this.getPlayerUrl(s11Player), this.getOptions()).pipe(
            map((jsonStatistics: JsonStatistics[]) => {
                const personId = s11Player.getPerson().getId();
                jsonStatistics.forEach((jsonStatistics: JsonStatistics) => {
                    const gameRoundNr = jsonStatistics.gameRound?.number;
                    if( gameRoundNr !== undefined ) {
                        getter.addStatistics(gameRoundNr, personId, this.mapper.toObject(jsonStatistics));
                    }
                });
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
