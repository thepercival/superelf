import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Formation, FormationMapper } from 'ngx-sport';
import { PoolUser } from '../pool/user';
import { S11FormationMapper } from './mapper';
import { S11Formation } from '../formation';
import { JsonS11Formation } from './json';

@Injectable()
export class FormationRepository extends APIRepository {
    constructor(
        private mapper: S11FormationMapper,
        private sportsFormationMapper: FormationMapper,
        private http: HttpClient) {
        super();
    }

    getUrl(poolUser: PoolUser, formation?: S11Formation): string {
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

    editObject(poolUser: PoolUser, availableFormation: Formation): Observable<S11Formation> {
        const viewPeriod = poolUser.getPool().getAssemblePeriod().getViewPeriod();
        const jsonFormation = this.sportsFormationMapper.toJson(availableFormation);
        return this.http.put<JsonS11Formation>(this.getUrl(poolUser), jsonFormation, { headers: super.getHeaders() }).pipe(
            map((jsonS11Formation: JsonS11Formation) => {
                const formation = this.mapper.toObject(jsonS11Formation, poolUser, viewPeriod);
                poolUser.setAssembleFormation(formation);
                console.log(jsonS11Formation, formation);
                return formation;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /*removeObject(poolUser: PoolUser, assembleFormation: S11Formation): Observable<void> {
        const url = this.getUrl(poolUser, assembleFormation);
        return this.http.delete(url, this.getOptions()).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    addPerson(person: Person, line: FormationLine, asSubstitute: boolean): Observable<S11Player> {
        if (asSubstitute) {
            return this.editSubstitute(person, line);
        }
        return this.addPlayer(person, line);
    }

    addPlayer(person: Person, line: FormationLine): Observable<S11Player> {
        const formation = line.getFormation();
        const json = this.personMapper.toJson(person);
        const urlSuffix = '/lines/' + line.getNumber() + '/players';
        const url = this.getUrl(formation.getPoolUser(), formation) + urlSuffix;
        return this.http.post<JsonS11Player>(url, json, { headers: super.getHeaders() }).pipe(
            map((jsonPlayer: JsonS11Player) => {
                const player = this.playerMapper.toObject(jsonPlayer, formation.getViewPeriod());
                line.getPlayers().push(player);
                return player;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editSubstitute(person: Person, line: FormationLine): Observable<S11Player> {
        const formation = line.getFormation();
        const json = this.personMapper.toJson(person);
        const urlSuffix = '/lines/' + line.getNumber() + '/substitute';
        const url = this.getUrl(formation.getPoolUser(), formation) + urlSuffix;
        return this.http.post<JsonS11Player>(url, json, { headers: super.getHeaders() }).pipe(
            map((jsonPlayer: JsonS11Player) => {
                const player = this.playerMapper.toObject(jsonPlayer, formation.getViewPeriod());
                line.setSubstitute(player);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removePlayer(player: S11Player, line: FormationLine): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/lines/' + line.getNumber() + '/players/' + player.getId();
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                const index = line.getPlayers().indexOf(player);
                if (index > -1) {
                    line.getPlayers().splice(index, 1);
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeSubstitute(player: S11Player, line: FormationLine): Observable<void> {
        const formation = line.getFormation();
        const url = this.getUrl(formation.getPoolUser(), formation) + '/lines/' + line.getNumber() + '/substitute/' + player.getId();
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => line.setSubstitute(undefined)),
            catchError((err) => this.handleError(err))
        );
    }*/
}
