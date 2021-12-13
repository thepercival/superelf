import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { ScoutedPlayerMapper } from './mapper';
import { JsonScoutedPlayer } from './json';
import { ScoutedPlayer } from '../scoutedPlayer';
import { ViewPeriod } from '../period/view';
import { S11Player } from '../player';
import { S11PlayerMapper } from '../player/mapper';


@Injectable()
export class ScoutedPlayerRepository extends APIRepository {
    constructor(
        private mapper: ScoutedPlayerMapper, private s11PlayerMapper: S11PlayerMapper, private http: HttpClient) {
        super();
    }

    getUrl(viewPeriod: ViewPeriod): string {
        return super.getApiUrl() + 'viewperiods/' + viewPeriod.getId() + '/scoutedplayers';
    }

    getObjects(viewPeriod: ViewPeriod): Observable<ScoutedPlayer[]> {
        return this.http.get<JsonScoutedPlayer[]>(this.getUrl(viewPeriod), this.getOptions()).pipe(
            map((jsonScoutedPlayers: JsonScoutedPlayer[]) => jsonScoutedPlayers.map(jsonScoutedPlayer => {
                return this.mapper.toObject(jsonScoutedPlayer, viewPeriod);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(s11Player: S11Player, viewPeriod: ViewPeriod): Observable<ScoutedPlayer> {
        const json: JsonScoutedPlayer = {
            id: 0,
            s11Player: this.s11PlayerMapper.toJson(s11Player),
            nrOfStars: 0
        };
        return this.http.post<JsonScoutedPlayer>(this.getUrl(viewPeriod), json, { headers: super.getHeaders() }).pipe(
            map((jsonScoutedPlayer: JsonScoutedPlayer) => this.mapper.toObject(jsonScoutedPlayer, viewPeriod)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(scoutedPlayer: ScoutedPlayer, viewPeriod: ViewPeriod): Observable<void> {
        const url = this.getUrl(viewPeriod) + '/' + scoutedPlayer.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }
}
