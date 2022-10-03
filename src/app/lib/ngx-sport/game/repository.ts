import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AgainstGame, AgainstSide, Competition, GameMapper, JsonAgainstGame, JsonTogetherGame, Poule, TogetherGame } from 'ngx-sport';
import { GameRound } from '../../gameRound';
import { ViewPeriod } from '../../period/view';
import { AgainstGameLineupItem, JsonAgainstGameLineupItem } from './football';
import { AgainstGameMapper } from './mapper';

@Injectable({
    providedIn: 'root'
})
export class GameRepository extends APIRepository {

    constructor(
        private mapper: GameMapper, private againstMapper: AgainstGameMapper, private http: HttpClient) {
        super();
    }

    getUrl(sourceCompetition: Competition): string {
        return this.getApiUrl() + 'competitions/' + sourceCompetition.getId();
    }

    getSourceObjects(poule: Poule, gameRound: GameRound): Observable<AgainstGame[]> {
        if (gameRound.hasAgainstGames()) {
            return of(gameRound.getAgainstGames());
        }
        const url = this.getUrl(poule.getCompetition()) + '/gamerounds/' + gameRound.getNumber();
        return this.http.get<JsonAgainstGame[]>(url, this.getOptions()).pipe(
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

    getSourceObjectLineup(game: AgainstGame, side: AgainstSide): Observable<AgainstGameLineupItem[]> {
        const competition = game.getPoule().getCompetition();
        const url = this.getUrl(competition) + '/sourcegames/' + game.getId() + '/lineups/' + side;

        return this.http.get<JsonAgainstGameLineupItem[]>(url, this.getOptions()).pipe(
            map((jsonAgainstGameLineupItems: JsonAgainstGameLineupItem[]) => {
                return this.againstMapper.toLineup(jsonAgainstGameLineupItems, competition);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    // getPoolCompetitionObjects(poule: Poule, viewPeriod: ViewPeriod): Observable<TogetherGame[]> {
    //     // if (poule.getTogetherGames().length > 0) {
    //     //     return of(gameRound.getAgainstGames());
    //     // }
    //     const url = this.getUrl(poule.getCompetition()) + '/viewperiods/' + viewPeriod.getId();
    //     return this.http.get<JsonTogetherGame[]>(url, this.getOptions()).pipe(
    //         map((jsonGames: JsonTogetherGame[]) => {
    //             return jsonGames.map((jsonGames: JsonTogetherGame) => {
    //                 return this.mapper.toNewTogether(jsonGames, poule, poule.getCompetition().getSingleSport());
    //             });
    //         }),
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}
