import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition, JsonSeason, Season, SeasonMapper } from 'ngx-sport';
import { APIRepository } from '../repository';
import { LeagueName } from '../leagueName';

@Injectable({
    providedIn: 'root'
})
export class SeasonRepository extends APIRepository {
    constructor(
        private mapper: SeasonMapper, private http: HttpClient) {
        super();
    }

    getUrl(): string {
        return super.getApiUrl() + 'public/seasons';
    }

    getObjects(filter?: SeasonFilter): Observable<Season[]> {
        const options = {
            headers: super.getHeaders(),
            params: this.getHttpParams(filter)
        };
        return this.http.get<JsonSeason[]>(this.getUrl(), options).pipe(
            map((jsonSeasons: JsonSeason[]) => jsonSeasons.map((jsonSeason: JsonSeason): Season => {
                return this.mapper.toObject(jsonSeason);
            })),
            catchError((err) => this.handleError(err))
        );
    }

    private getHttpParams(filter?: SeasonFilter): HttpParams {
        let httpParams = new HttpParams();
        if (filter === undefined) {
            return httpParams;
        }
        if (filter.leagueName !== undefined) {
            httpParams = httpParams.set('leagueName', filter.leagueName);
        }
        return httpParams;
    }

}

export interface SeasonFilter {
    leagueName?: LeagueName;
}