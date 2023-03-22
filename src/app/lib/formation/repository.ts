import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { Competition, Formation, FormationMapper, Person, PersonMapper, Player, PlayerMapper } from 'ngx-sport';
import { PoolUser } from '../pool/user';
import { S11FormationMapper } from './mapper';
import { S11Formation } from '../formation';
import { JsonS11Formation } from './json';
import { S11FormationPlace } from './place';
import { JsonS11Player } from '../player/json';
import { S11PlayerMapper } from '../player/mapper';
import { S11Player } from '../player';
import { JsonReplacement } from '../editAction/replacement/json';
import { EditActionMapper } from '../editAction/mapper';
import { Replacement } from '../editAction/replacement';
import { Transfer } from '../editAction/transfer';
import { JsonTransfer } from '../editAction/transfer/json';
import { Substitution } from '../editAction/substitution';
import { JsonSubstitution } from '../editAction/substitution/json';
import { ViewPeriod } from '../period/view';
import { AssemblePeriod } from '../period/assemble';
import { TransferPeriod } from '../period/transfer';
import { Pool } from '../pool';
import { S11FormationMap } from '../../poolmodule/schedule/allinonegame.component';

@Injectable({
    providedIn: 'root'
})
export class FormationRepository extends APIRepository {
    constructor(
        private mapper: S11FormationMapper,
        private personMapper: PersonMapper,
        private playerMapper: PlayerMapper,
        private sportsFormationMapper: FormationMapper,
        private s11PlayerMapper: S11PlayerMapper,
        private transferActionMapper: EditActionMapper,
        private http: HttpClient) {
        super();
    }

    getUrl(poolUser: PoolUser, formation?: S11Formation, place?: S11FormationPlace): string {
        let baseUrl = super.getApiUrl() + 'poolusers/' + poolUser.getId();
        baseUrl += '/formations' + (formation ? ('/' + formation.getId()) : '');
        if (place) {
            baseUrl += '/places/' + place.getId();
        }
        return baseUrl;
    }

    getMapUrl(pool: Pool, viewPeriod: ViewPeriod): string {
        return super.getApiUrl() + 'pools/' + pool.getId() + '/viewperiods/' + viewPeriod.getId();
    }

    getTransferPeriodActionUrl(poolUser: PoolUser, action: string, id?: string|number): string {
        return super.getApiUrl() + 'poolusers/' + poolUser.getId() + '/' + action + (id ? '/' + id : '');
    }


    getObject(poolUser: PoolUser, editOrViewPeriod: AssemblePeriod | TransferPeriod | ViewPeriod): Observable<S11Formation> {
        const viewPeriod = editOrViewPeriod instanceof ViewPeriod ? editOrViewPeriod : editOrViewPeriod.getViewPeriod();
        const url = super.getApiUrl() + 'poolusers/' + poolUser.getId() + '/viewperiods/' + viewPeriod.getId();
        return this.http.get<JsonS11Formation>(url, this.getOptions()).pipe(
            map((jsonFormation: JsonS11Formation) => this.mapper.toObject(jsonFormation, poolUser, viewPeriod)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjectMap(pool: Pool, editOrViewPeriod: AssemblePeriod | TransferPeriod | ViewPeriod): Observable<S11FormationMap> {
        const viewPeriod = editOrViewPeriod instanceof ViewPeriod ? editOrViewPeriod : editOrViewPeriod.getViewPeriod();
        return this.http.get<JsonS11FormationMap>(this.getMapUrl(pool,viewPeriod), this.getOptions()).pipe(
            map((jsonFormationMap: JsonS11FormationMap) => {
                const map = new Map<number,S11Formation>();
                for (const [poolUserId, jsonFormation] of Object.entries(jsonFormationMap)) {
                    const poolUser = pool.getUsers().find(poolUser => poolUser.getId() == poolUserId);
                    if( poolUser !== undefined ) {
                        map.set(+poolUserId, this.mapper.toObject(jsonFormation, poolUser, viewPeriod));
                    }
                }
                return map;                
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(poolUser: PoolUser, availableFormation: Formation): Observable<S11Formation> {
        const viewPeriod = poolUser.getPool().getAssemblePeriod().getViewPeriod();
        const jsonFormation = this.sportsFormationMapper.toJson(availableFormation);
        return this.http.put<JsonS11Formation>(this.getUrl(poolUser), jsonFormation, { headers: super.getHeaders() }).pipe(
            map((jsonS11Formation: JsonS11Formation) => {
                const formation = this.mapper.toObject(jsonS11Formation, poolUser, viewPeriod);
                // poolUser.setAssembleFormation(formation);
                return formation;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editPlace(place: S11FormationPlace, person: Person | undefined): Observable<S11Player | undefined> {
        const formation = place.getFormationLine().getFormation();
        const poolUser = formation.getPoolUser();
        const url = this.getUrl(poolUser, formation, place);
        const pool = poolUser.getPool();
        const competition: Competition = pool.getCompetitionConfig().getSourceCompetition();
        const viewPeriod = pool.getAssemblePeriod().getViewPeriod();
        const jsonPerson = person ? this.personMapper.toJson(person) : undefined;
        return this.http.post<JsonS11Player | undefined>(url, jsonPerson, { headers: super.getHeaders() }).pipe(
            map((jsonS11Player: JsonS11Player | undefined) => {
                const s11Player = jsonS11Player ? this.s11PlayerMapper.toObject(jsonS11Player, competition, viewPeriod) : undefined;
                place.setPlayer(s11Player);
                return s11Player;
            }),
            catchError((err) => this.handleError(err))
        );
    }


    replace(jsonReplacement: JsonReplacement, poolUser: PoolUser): Observable<Replacement> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'replace');
        const pool = poolUser.getPool();
        const competition: Competition = pool.getCompetitionConfig().getSourceCompetition();
        // const jsonPlayer = this.playerMapper.toJson(player);
        
        return this.http.post<JsonReplacement>(url, jsonReplacement, { headers: super.getHeaders() }).pipe(
            map((jsonReplacement: JsonReplacement): Replacement => {
                return this.transferActionMapper.toReplacement(jsonReplacement, poolUser, competition.getAssociation());
            }),
            catchError((err) => this.handleError(err))
        );
    }

    transfer(jsonTransfer: JsonTransfer, poolUser: PoolUser): Observable<Transfer> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'transfer');
        const pool = poolUser.getPool();
        const competition: Competition = pool.getCompetitionConfig().getSourceCompetition();
        
        return this.http.post<JsonTransfer>(url, jsonTransfer, { headers: super.getHeaders() }).pipe(
            map((jsonReplacement: JsonTransfer): Transfer => {
                return this.transferActionMapper.toTransfer(jsonReplacement, poolUser, competition.getAssociation());
            }),
            catchError((err) => this.handleError(err))
        );
    }

    substitute(jsonSubstitution: JsonSubstitution, poolUser: PoolUser): Observable<Substitution> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'substitute');        
        return this.http.post<JsonSubstitution>(url, jsonSubstitution, { headers: super.getHeaders() }).pipe(
            map((jsonSubstitution: JsonSubstitution): Substitution => {
                return this.transferActionMapper.toSubstitution(jsonSubstitution, poolUser);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeReplacement(replacement: Replacement, poolUser: PoolUser): Observable<void> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'replace', replacement.getId());
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                const replacements = poolUser.getTransferPeriodActionList().replacements;
                const idx = replacements.indexOf(replacement);
                if (idx >= 0) {
                    replacements.splice(idx);                     
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeTransfer(transfer: Transfer, poolUser: PoolUser): Observable<void> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'transfer', transfer.getId());
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                const transfers = poolUser.getTransferPeriodActionList().transfers;
                const idx = transfers.indexOf(transfer);
                if (idx >= 0) {
                    transfers.splice(idx);                     
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeSubstitution(substitution: Substitution, poolUser: PoolUser): Observable<void> {
        const url = this.getTransferPeriodActionUrl(poolUser, 'substitute', substitution.getId());
        return this.http.delete<void>(url, { headers: super.getHeaders() }).pipe(
            map(() => {
                const substitutions = poolUser.getTransferPeriodActionList().substitutions;
                const idx = substitutions.indexOf(substitution);
                if (idx >= 0) {
                    substitutions.splice(idx);                     
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }
}

export interface JsonS11FormationMap extends Map<number,JsonS11Formation>{};