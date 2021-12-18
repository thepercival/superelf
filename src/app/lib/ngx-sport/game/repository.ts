import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AgainstGame, AgainstSportVariant, Competition, CompetitionSport, Game, GameMapper, JsonAgainstGame, JsonTogetherGame, Poule, TogetherGame } from 'ngx-sport';
import { GameRound } from '../../gameRound';

@Injectable({
    providedIn: 'root'
})
export class GameRepository extends APIRepository {

    constructor(
        private mapper: GameMapper, private http: HttpClient) {
        super();
    }

    getUrl(sourceCompetition: Competition, gameRoundNumber: number): string {
        return this.getApiUrl() + 'competitions/' + sourceCompetition.getId() + '/gamerounds/' + gameRoundNumber;
    }

    getSourceObjects(poule: Poule, gameRound: GameRound): Observable<AgainstGame[]> {
        if (gameRound.hasAgainstGames()) {
            return of(gameRound.getAgainstGames());
        }
        return this.http.get<JsonAgainstGame[]>(this.getUrl(poule.getCompetition(), gameRound.getNumber()), this.getOptions()).pipe(
            map((jsonAgainstGames: JsonAgainstGame[]) => {
                const againstGames = jsonAgainstGames.map((jsonAgainstGame: JsonAgainstGame) => {
                    return this.mapper.toNewAgainst(jsonAgainstGame, poule, poule.getCompetition().getSingleSport());
                });
                gameRound.setAgainstGames(againstGames);
                return againstGames;
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
