import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { StructureMapper, Structure, JsonStructure, Competition } from 'ngx-sport';
import { APIRepository } from '../../repository';

@Injectable({
    providedIn: 'root'
})
export class StructureRepository extends APIRepository {

    constructor(
        private mapper: StructureMapper,
        private http: HttpClient) {
        super();
    }

    getUrl(competition: Competition): string {
        return this.getApiUrl() + 'competitions/' + competition.getId() + '/structure';
    }

    getObject(competition: Competition): Observable<Structure> {
        return this.http.get<JsonStructure>(this.getUrl(competition), this.getOptions()).pipe(
            map((json: JsonStructure) => {
                return this.mapper.toObject(json, competition);
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
