import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Competitor, Competition, JsonPerson, PersonMapper, Person, Team } from 'ngx-sport';
import { Pool } from '../../pool';
import { PoolCompetitorMapper } from '../../pool/competitor/mapper';
import { PoolCompetitor } from '../../pool/competitor';
import { User } from '../../user';
import { JsonPoolCompetitor } from '../../pool/competitor/json';


@Injectable()
export class PersonRepository extends APIRepository {

    constructor(
        private mapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'persons';
    }

    getUrl(): string {
        return super.getApiUrl() + this.getUrlpostfix();
    }

    getObjects(sourceCompetition: Competition, team?: Team, line?: number): Observable<Person[]> {
        const jsonFilter = {
            startDateTime: sourceCompetition.getSeason().getStartDateTime().toISOString(),
            endDateTime: sourceCompetition.getSeason().getEndDateTime().toISOString(),
            teamId: team?.getId(),
            line: line
        };
        return this.http.post<JsonPerson[]>(this.getUrl(), jsonFilter, this.getOptions()).pipe(
            map((jsonPersons: JsonPerson[]) => jsonPersons.map(jsonPerson => {
                return this.mapper.toObject(jsonPerson, sourceCompetition.getLeague().getAssociation());
            })),
            catchError((err) => this.handleError(err))
        );
    }

}
