import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AgainstGame, AgainstSide, Competition, GameMapper, JsonAgainstGame, JsonTogetherGame, Poule, TogetherGame } from 'ngx-sport';
import { GameRound } from '../../gameRound';
import { ViewPeriod } from '../../periods/viewPeriod';
import { AgainstGameCardEvent, AgainstGameEvent, AgainstGameGoalEvent, AgainstGameLineupItem, JsonAgainstGameCardEvent, JsonAgainstGameEvent, JsonAgainstGameGoalEvent, JsonAgainstGameLineupItem } from './football';
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
        return this.getApiUrl() + 'public/competitions/' + sourceCompetition.getId();
    }

    getSourceObjects(poule: Poule, gameRoundNr: number): Observable<AgainstGame[]> {
        const url =
          this.getUrl(poule.getCompetition()) + "/gamerounds/" + gameRoundNr;
        return this.http.get<JsonAgainstGame[]>(url, this.getOptions()).pipe(
            map((jsonAgainstGames: JsonAgainstGame[]) => {
                return jsonAgainstGames.map((jsonAgainstGame: JsonAgainstGame) => {
                    return this.mapper.toNewAgainst(jsonAgainstGame, poule, poule.getCompetition().getSingleSport());
                });
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

    getSourceObjectEvents(game: AgainstGame, side: AgainstSide): Observable<(AgainstGameGoalEvent|AgainstGameCardEvent)[]> {
        const competition = game.getPoule().getCompetition();
        const url = this.getUrl(competition) + '/sourcegames/' + game.getId() + '/events/' + side;

        return this.http.get<(JsonAgainstGameGoalEvent|JsonAgainstGameCardEvent)[]>(url, this.getOptions()).pipe(
            map((jsonAgainstGameEvents: (JsonAgainstGameGoalEvent|JsonAgainstGameCardEvent)[]) => {
                return this.againstMapper.toEvents(jsonAgainstGameEvents, competition);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getSourceObjectExternalLink(game: AgainstGame): Observable<string> {
        const competition = game.getPoule().getCompetition();
        const url = this.getUrl(competition) + '/sourcegames/' + game.getId() + '/sofascore';

        return this.http.get<JsonExternalLink>(url, this.getOptions()).pipe(
          map((json: JsonExternalLink): string => {
            return json.link;
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

interface JsonExternalLink{
    link: string;
}