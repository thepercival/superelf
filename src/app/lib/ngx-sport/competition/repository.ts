import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { Competition, CompetitionMapper, JsonCompetition } from 'ngx-sport';

@Injectable()
export class CompetitionRepository extends APIRepository {

    constructor(
        private mapper: CompetitionMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getUrl(id: number | string): string {
        return super.getApiUrl() + this.getUrlpostfix() + '/' + id;
    }

    getObject(id: number | string): Observable<Competition> {
        return this.http.get(this.getUrl(id), { headers: super.getHeaders() }).pipe(
            map((json: JsonCompetition) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }
}
