import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Competition, PersonMapper } from 'ngx-sport';
import { ViewPeriod } from '../period/view';


@Injectable()
export class StatisticsRepository extends APIRepository {
    constructor(
        private personMapper: PersonMapper, private http: HttpClient) {
        super();
    }

    getUrl(viewPeriod: ViewPeriod): string {
        return super.getApiUrl() + 'viewperiods/' + viewPeriod.getId() + '/scoutedplayer';
    }

    // @TODO CDK UPDATE STATISTICS

    // getObjects(sourceCompetition: Competition): Observable<ScoutedPerson[]> {
    //     const association = sourceCompetition.getLeague().getAssociation();
    //     return this.http.get<JsonScoutedPerson[]>(this.getUrl(sourceCompetition), this.getOptions()).pipe(
    //         map((jsonScoutedPersons: JsonScoutedPerson[]) => jsonScoutedPersons.map(jsonScoutedPerson => {
    //             return this.mapper.toObject(jsonScoutedPerson, association);
    //         })),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // createObject(person: Person, sourceCompetition: Competition): Observable<ScoutedPerson> {
    //     const association = sourceCompetition.getLeague().getAssociation();
    //     const json: JsonScoutedPerson = {
    //         id: 0,
    //         person: this.personMapper.toJson(person),
    //         nrOfStars: 0
    //     };
    //     return this.http.post<JsonScoutedPerson>(this.getUrl(sourceCompetition), json, { headers: super.getHeaders() }).pipe(
    //         map((jsonScoutedPerson: JsonScoutedPerson) => this.mapper.toObject(jsonScoutedPerson, association)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // removeObject(scoutedPerson: ScoutedPerson, sourceCompetition: Competition): Observable<void> {
    //     const url = this.getUrl(sourceCompetition) + '/' + scoutedPerson.getId();
    //     return this.http.delete(url, this.getOptions()).pipe(
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}
