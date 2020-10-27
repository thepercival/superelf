import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Field, FieldMapper, JsonField, SportConfig } from 'ngx-sport';
import { Tournament } from '../../pool';


@Injectable()
export class FieldRepository extends APIRepository {

    constructor(
        private mapper: FieldMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'fields';
    }

    getUrl(tournament: Tournament, sportConfig: SportConfig): string {
        return super.getApiUrl() + 'tournaments/' + tournament.getId() + '/sportconfigs/' + sportConfig.getId() + '/' + this.getUrlpostfix();
    }

    createObject(json: JsonField, sportConfig: SportConfig, tournament: Tournament): Observable<Field> {
        return this.http.post(this.getUrl(tournament, sportConfig), json, this.getOptions()).pipe(
            map((jsonRes: JsonField) => this.mapper.toObject(jsonRes, sportConfig)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(field: Field, tournament: Tournament): Observable<Field> {
        const url = this.getUrl(tournament, field.getSportConfig()) + '/' + field.getId();
        return this.http.put(url, this.mapper.toJson(field), this.getOptions()).pipe(
            map((res: JsonField) => this.mapper.toObject(res, field.getSportConfig(), field)),
            catchError((err) => this.handleError(err))
        );
    }

    upgradeObject(field: Field, tournament: Tournament): Observable<void> {
        const sportConfig = field.getSportConfig();
        const url = this.getUrl(tournament, sportConfig) + '/' + field.getId() + '/priorityup';
        return this.http.post(url, undefined, this.getOptions()).pipe(
            map(() => {
                const downgrade = sportConfig.getField(field.getPriority() - 1);
                field.setPriority(downgrade.getPriority());
                downgrade.setPriority(downgrade.getPriority() + 1);
                sportConfig.getFields().sort((fieldA, fieldB) => fieldA.getPriority() - fieldB.getPriority());
            }),
            catchError((err) => this.handleError(err))
        );
    }


    removeObject(field: Field, tournament: Tournament): Observable<void> {
        const sportConfig = field.getSportConfig();
        const url = this.getUrl(tournament, sportConfig) + '/' + field.getId();
        return this.http.delete(url, this.getOptions()).pipe(
            map((res) => {
                const index = sportConfig.getFields().indexOf(field);
                if (index > -1) {
                    sportConfig.getFields().splice(index, 1);
                }
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
