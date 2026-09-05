import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { PoolUser } from '../pool/user';
import { AchievementMapper } from './mapper';
import { Trophy } from './trophy';
import { Badge } from './badge';
import { JsonBadge } from './badge/json';
import { JsonTrophy } from './trophy/json';
import { PoolCollection } from '../pool/collection';
import { Pool } from '../pool';

export interface GoatSummary {
    userId: number | null;
    points: number;
}

@Injectable({
    providedIn: 'root'
})
export class AchievementRepository extends APIRepository {
    private readonly goatSummaries = new Map<number, Observable<GoatSummary>>();

    constructor(private mapper: AchievementMapper, private http: HttpClient) {
        super();
    }

    getPoolUrl(pool: Pool): string {
        return this.getApiUrl() + 'pools/' + pool.getId() + '/achievements/';
    }

    getPoolUserUrl(poolUser: PoolUser): string {
        return this.getApiUrl() + 'poolusers/' + poolUser.getId() + '/achievements/';
    }

    getUnviewedObjects(pool: Pool): Observable<(Trophy|Badge)[]> {
        return this.http.get<(JsonTrophy|JsonBadge)[]>(this.getPoolUrl(pool) + 'unviewed', this.getOptions()).pipe(
            map((jsonAchievements: (JsonTrophy|JsonBadge)[]) => jsonAchievements.map((jsonAchievement: JsonTrophy|JsonBadge): Trophy|Badge => {
                return this.mapper.toObject(jsonAchievement);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    removeUnviewedObjects(poolUser: PoolUser): Observable<void> {
        return this.http.delete<(JsonTrophy|JsonBadge)[]>(this.getPoolUserUrl(poolUser) + 'viewed', this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    getPoolCollection(poolCollection: PoolCollection): Observable<(Trophy|Badge)[]> {
        const url = this.getApiUrl() + 'poolcollections/' + poolCollection.getId() + '/achievements';
        return this.http.get<(JsonTrophy|JsonBadge)[]>(url, this.getOptions()).pipe(
            map((jsonAchievements: (JsonTrophy|JsonBadge)[]) => jsonAchievements.map((jsonAchievement: JsonTrophy|JsonBadge): Trophy|Badge => {
                return this.mapper.toObject(jsonAchievement);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    getGoat(poolCollection: PoolCollection): Observable<GoatSummary> {
        const poolCollectionId = poolCollection.getId();
        let goatSummary = this.goatSummaries.get(poolCollectionId);
        if (goatSummary === undefined) {
            const url = this.getApiUrl() + 'poolcollections/' + poolCollectionId + '/goat';
            goatSummary = this.http.get<GoatSummary>(url, this.getOptions()).pipe(
                catchError((err) => this.handleError(err)),
                shareReplay(1)
            );
            this.goatSummaries.set(poolCollectionId, goatSummary);
        }
        return goatSummary;
    }

    // getNrOfUnreadObjects(poule: Poule, pool: Pool): Observable<number> {
    //     return this.http.get<JsonChatMessage[]>(this.getUrl(pool, poule, 'nrofunreadmessages'), this.getOptions()).pipe(
    //         map((json: any) => json.nrOfUnreadMessages),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

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
