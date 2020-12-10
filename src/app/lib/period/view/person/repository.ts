import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonMapper, Team } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIRepository } from '../../../repository';

import { ViewPeriod } from '../../view';
import { ViewPeriodPerson } from '../person';
import { JsonViewPeriodPerson } from './json';
import { ViewPeriodPersonMapper } from './mapper';


@Injectable()
export class ViewPeriodPersonRepository extends APIRepository {
    constructor(
        private mapper: ViewPeriodPersonMapper, private personMapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'viewperiodpersons';
    }

    getUrl(): string {
        return super.getApiUrl() + this.getUrlpostfix();
    }

    getObjects(viewPeriod: ViewPeriod, team?: Team, line?: number): Observable<ViewPeriodPerson[]> {
        const jsonFilter = {
            viewPeriodId: viewPeriod.getId(),
            teamId: team?.getId(),
            line: line
        };
        return this.http.post<JsonViewPeriodPerson[]>(this.getUrl(), jsonFilter, this.getOptions()).pipe(
            map((jsonViewPeriodPersons: JsonViewPeriodPerson[]) => jsonViewPeriodPersons.map(jsonViewPeriodPerson => {
                return this.mapper.toObject(jsonViewPeriodPerson, viewPeriod);
            })),
            catchError((err) => this.handleError(err))
        );
    }
}
