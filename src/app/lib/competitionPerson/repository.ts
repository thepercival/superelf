import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Competition, Person, PersonMapper, Team } from 'ngx-sport';
import { ScoutedPerson } from '../scoutedPerson';
import { CompetitionPersonMapper } from './mapper';
import { JsonCompetitionPerson } from './json';
import { CompetitionPerson } from '../competitionPerson';


@Injectable()
export class CompetitionPersonRepository extends APIRepository {
    constructor(
        private mapper: CompetitionPersonMapper, private personMapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitionpersons';
    }

    getUrl(): string {
        return super.getApiUrl() + this.getUrlpostfix();
    }

    getObjects(sourceCompetition: Competition, team?: Team, line?: number): Observable<CompetitionPerson[]> {
        const jsonFilter = {
            sourceCompetitionId: sourceCompetition.getId(),
            teamId: team?.getId(),
            line: line
        };
        return this.http.post<JsonCompetitionPerson[]>(this.getUrl(), jsonFilter, this.getOptions()).pipe(
            map((jsoncompetitionPersons: JsonCompetitionPerson[]) => jsoncompetitionPersons.map(jsoncompetitionPerson => {
                return this.mapper.toObject(jsoncompetitionPerson, sourceCompetition);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
