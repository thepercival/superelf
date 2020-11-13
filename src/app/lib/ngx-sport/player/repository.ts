import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Competition, JsonPlayer, Player, Team } from 'ngx-sport';
import { PlayerMapper, PersonMapper } from 'ngx-sport';

@Injectable()
export class PlayerRepository extends APIRepository {

    constructor(
        private mapper: PlayerMapper, private personMapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'players';
    }

    getUrl(): string {
        return super.getApiUrl() + this.getUrlpostfix();
    }

    getObjects(sourceCompetition: Competition, team: Team | undefined, line: number | undefined): Observable<(Player)[]> {
        const jsonFilter = {
            start: sourceCompetition.getSeason().getStartDateTime().toISOString(),
            end: sourceCompetition.getSeason().getEndDateTime().toISOString(),
            teamId: team?.getId(),
            line: line
        };
        const association = sourceCompetition.getLeague().getAssociation();
        return this.http.post<JsonPlayer[]>(this.getUrl(), jsonFilter, this.getOptions()).pipe(
            map((jsonPlayers: JsonPlayer[]) => <Player[]>jsonPlayers.map(jsonPlayer => {
                if (!jsonPlayer.person) {
                    return undefined;
                }
                const person = this.personMapper.toObject(jsonPlayer.person, association, undefined);
                return this.mapper.toObject(
                    jsonPlayer,
                    association,
                    person);
            })),
            catchError((err) => this.handleError(err))
        );
    }

}
