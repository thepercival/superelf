import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AgainstGame, JsonAgainstGame, Poule } from 'ngx-sport';
import { APIRepository } from '../repository';
import { JsonChatMessage } from './json';
import { PoolUser } from '../pool/user';
import { ChatMessage } from '../chatMessage';
import { ChatMessageMapper } from './mapper';
import { Pool } from '../pool';

@Injectable({
    providedIn: 'root'
})
export class ChatMessageRepository extends APIRepository {

    constructor(private mapper: ChatMessageMapper, private http: HttpClient) {
        super();
    }

    getUrl(pool: Pool, poule: Poule, suffix: string): string {
        return this.getApiUrl() + 'pools/' + pool.getId() + '/poules/' + poule.getId() + '/' + suffix;
    }

    createObject(message: string, poule: Poule, pool: Pool): Observable<ChatMessage> {
        const json = { message };
        return this.http.post<JsonChatMessage>(this.getUrl(pool, poule, 'messages'), json, { headers: super.getHeaders() }).pipe(
            map((json: JsonChatMessage) => this.mapper.toObject(json, pool.getUsers())),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(poule: Poule, pool: Pool): Observable<ChatMessage[]> {
        return this.http.get<JsonChatMessage[]>(this.getUrl(pool, poule, 'messages'), this.getOptions()).pipe(
            map((jsonMessages: JsonChatMessage[]) => jsonMessages.map((jsonMessage: JsonChatMessage): ChatMessage => {
                return this.mapper.toObject(jsonMessage, pool.getUsers());
            })),
            catchError((err) => this.handleError(err))
        );
    }

    getNrOfUnreadObjects(poule: Poule, pool: Pool): Observable<number> {
        return this.http.get<JsonChatMessage[]>(this.getUrl(pool, poule, 'nrofunreadmessages'), this.getOptions()).pipe(
            map((json: any) => json.nrOfUnreadMessages),
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
