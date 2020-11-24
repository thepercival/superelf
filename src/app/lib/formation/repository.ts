import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Person, Sport } from 'ngx-sport';
import { JsonFormationShell } from '../activeConfig/json';
import { FormationMapper } from './mapper';
import { Pool } from '../pool';
import { JsonFormation } from './json';
import { Formation } from '../formation';
import { PoolUser } from '../pool/user';
import { FormationLine } from './line';

@Injectable()
export class FormationRepository extends APIRepository {
    constructor(
        private mapper: FormationMapper, private http: HttpClient) {
        super();
    }

    getUrl(poolUser: PoolUser, formation?: Formation): string {
        let baseUrl = super.getApiUrl() + 'poolusers/' + poolUser.getId();
        return baseUrl + '/formations' + (formation ? ('/' + formation.getId()) : '');
    }

    // getObjects(sport: Sport): Observable<Formation[]> {
    //     return this.http.get(this.getUrl(sport), this.getOptions()).pipe(
    //         map((jsonFormations: JsonFormation[]) => jsonFormations.map(jsonFormation => {
    //             return this.mapper.toObject(jsonFormation, sport);
    //         })),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    createObject(formationShell: JsonFormationShell, poolUser: PoolUser): Observable<Formation> {
        const association = poolUser.getPool().getSourceCompetition().getLeague().getAssociation();
        return this.http.post<JsonFormation>(this.getUrl(poolUser), formationShell, { headers: super.getHeaders() }).pipe(
            map((jsonFormation: JsonFormation) => this.mapper.toObject(jsonFormation, poolUser, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(formationShell: JsonFormationShell, formation: Formation): Observable<Formation> {
        const poolUser = formation.getPoolUser();
        const association = poolUser.getPool().getSourceCompetition().getLeague().getAssociation();
        return this.http.put<JsonFormation>(this.getUrl(poolUser, formation), formationShell, { headers: super.getHeaders() }).pipe(
            map((jsonFormation: JsonFormation) => this.mapper.toObject(jsonFormation, poolUser, association)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(assembleFormation: Formation): Observable<void> {
        const url = this.getUrl(assembleFormation.getPoolUser(), assembleFormation);
        return this.http.delete(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    addPerson(person: Person, line: FormationLine, asSubstitute: boolean): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/persons/' + person.getId();
        return this.http.post<void>(url, undefined, { headers: super.getHeaders() }).pipe(
            map(() => {
                asSubstitute ? line.setSubstitute(person) : line.getPersons().push(person);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removePerson(person: Person, line: FormationLine, asSubstitute: boolean): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/persons/' + person.getId();
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                if (asSubstitute) {
                    line.setSubstitute(undefined)
                } else {
                    const index = line.getPersons().indexOf(person);
                    if (index > -1) {
                        line.getPersons().splice(index, 1);
                    }
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
