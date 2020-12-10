import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Person, PersonMapper } from 'ngx-sport';
import { JsonFormationShell } from '../activeConfig/json';
import { FormationMapper } from './mapper';
import { JsonFormation } from './json';
import { Formation } from '../formation';
import { PoolUser } from '../pool/user';
import { FormationLine } from './line';
import { ViewPeriodPerson } from '../period/view/person';
import { ViewPeriodPersonMapper } from '../period/view/person/mapper';
import { PoolUserViewPeriodPerson } from '../pool/user/viewPeriodPerson';
import { ViewPeriod } from '../period/view';
import { JsonViewPeriodPerson } from '../period/view/person/json';
import { JsonPoolUserViewPeriodPerson } from '../pool/user/viewPeriodPerson/json';
import { PoolUserViewPeriodPersonMapper } from '../pool/user/viewPeriodPerson/mapper';

@Injectable()
export class FormationRepository extends APIRepository {
    constructor(
        private mapper: FormationMapper,
        private viewPeriodPersonMapper: ViewPeriodPersonMapper,
        private poolUserViewPeriodPersonMapper: PoolUserViewPeriodPersonMapper,
        private personMapper: PersonMapper,
        private http: HttpClient) {
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
        const viewPeriod = poolUser.getPool().getAssemblePeriod().getViewPeriod();
        return this.http.post<JsonFormation>(this.getUrl(poolUser), formationShell, { headers: super.getHeaders() }).pipe(
            map((jsonFormation: JsonFormation) => this.mapper.toObject(jsonFormation, poolUser, viewPeriod)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(formationShell: JsonFormationShell, formation: Formation): Observable<Formation> {
        const poolUser = formation.getPoolUser();
        const viewPeriod = poolUser.getPool().getAssemblePeriod().getViewPeriod();
        return this.http.put<JsonFormation>(this.getUrl(poolUser, formation), formationShell, { headers: super.getHeaders() }).pipe(
            map((jsonFormation: JsonFormation) => this.mapper.toObject(jsonFormation, poolUser, viewPeriod)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(assembleFormation: Formation): Observable<void> {
        const url = this.getUrl(assembleFormation.getPoolUser(), assembleFormation);
        return this.http.delete(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    addPerson(person: Person, line: FormationLine, asSubstitute: boolean): Observable<ViewPeriodPerson | PoolUserViewPeriodPerson> {
        if (asSubstitute) {
            return this.editSubstitute(person, line);
        }
        return this.addViewPeriodPerson(person, line);
    }

    addViewPeriodPerson(person: Person, line: FormationLine): Observable<ViewPeriodPerson> {
        const formation = line.getFormation();
        const json = this.personMapper.toJson(person);
        const urlSuffix = '/lines/' + line.getNumber() + '/viewperiodpersons';
        const url = this.getUrl(formation.getPoolUser(), formation) + urlSuffix;
        return this.http.post<JsonViewPeriodPerson>(url, json, { headers: super.getHeaders() }).pipe(
            map((jsonViewPeriodPerson: JsonViewPeriodPerson) => {
                const viewPeriodPerson = this.viewPeriodPersonMapper.toObject(jsonViewPeriodPerson, formation.getViewPeriod());
                line.getViewPeriodPersons().push(viewPeriodPerson);
                return viewPeriodPerson;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editSubstitute(person: Person, line: FormationLine): Observable<PoolUserViewPeriodPerson> {
        const formation = line.getFormation();
        const json = this.personMapper.toJson(person);
        const urlSuffix = '/lines/' + line.getNumber() + '/substitute';
        const url = this.getUrl(formation.getPoolUser(), formation) + urlSuffix;
        return this.http.post<JsonPoolUserViewPeriodPerson>(url, json, { headers: super.getHeaders() }).pipe(
            map((jsonPoolUserViewPeriodPerson: JsonPoolUserViewPeriodPerson) => {
                const poolUserViewPeriodPerson = this.poolUserViewPeriodPersonMapper.toObject(jsonPoolUserViewPeriodPerson, formation.getPoolUser(), formation.getViewPeriod());
                line.setSubstitute(poolUserViewPeriodPerson);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeViewPeriodPerson(viewPeriodPerson: ViewPeriodPerson, line: FormationLine): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/lines/' + line.getNumber() + '/viewperiodpersons/' + viewPeriodPerson.getId();
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                const index = line.getViewPeriodPersons().indexOf(viewPeriodPerson);
                if (index > -1) {
                    line.getViewPeriodPersons().splice(index, 1);
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeSubstitute(poolUserViewPeriodPerson: PoolUserViewPeriodPerson, line: FormationLine): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/lines/' + line.getNumber() + '/substitute/' + poolUserViewPeriodPerson.getId();
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => line.setSubstitute(undefined)),
            catchError((err) => this.handleError(err))
        );
    }
}
