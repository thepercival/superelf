import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../../repository';
import { SeasonScoreUnitMapper } from './mapper';
import { Season } from 'ngx-sport';
import { SeasonScoreUnit } from '../scoreUnit';
import { JsonSeasonScoreUnit } from './json';

@Injectable()
export class SeasonScoreUnitRepository extends APIRepository {

    constructor(
        private http: HttpClient,
        private mapper: SeasonScoreUnitMapper) {
        super();
    }

    getUrlpostfix(): string {
        return 'scoreunits';
    }


    getUrl(season: Season): string {
        return super.getApiUrl() + 'seasons/' + season.getId() + '/scoreunits';
    }

    getObjects(season: Season): Observable<SeasonScoreUnit[]> {
        return this.http.get<JsonSeasonScoreUnit[]>(this.getUrl(season), this.getOptions()).pipe(
            map((jsonScoreUnits: JsonSeasonScoreUnit[]) => jsonScoreUnits.map(jsonScoreUnit => {
                return this.mapper.toObject(jsonScoreUnit, season);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
