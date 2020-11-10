import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Association, Season } from 'ngx-sport';
import { ScoutedPersonMapper } from './mapper';
import { ScoutedPerson } from '../scoutedPerson';
import { Pool } from '../pool';
import { JsonScoutedPerson } from './json';


@Injectable()
export class ScoutedPersonRepository extends APIRepository {
    constructor(
        private mapper: ScoutedPersonMapper, private http: HttpClient) {
        super();
    }

    getUrl(season?: Season): string {
        return super.getApiUrl() + 'scoutedpersons/' + (season ? 'seasons/' + season.getId() : '');
    }

    getObjects(pool: Pool, association: Association): Observable<ScoutedPerson[]> {
        return this.http.get<JsonScoutedPerson[]>(this.getUrl(pool.getSeason()), this.getOptions()).pipe(
            map((jsonScoutedPersons: JsonScoutedPerson[]) => jsonScoutedPersons.map(jsonScoutedPerson => {
                return this.mapper.toObject(jsonScoutedPerson, association);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
