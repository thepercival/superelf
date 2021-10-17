import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActiveConfig } from '../activeConfig';

import { APIRepository } from '../repository';
import { JsonActiveConfig } from './json';
import { ActiveConfigMapper } from './mapper';

@Injectable()
export class ActiveConfigRepository extends APIRepository {
    private url: string;
    constructor(
        private mapper: ActiveConfigMapper,
        private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'activeconfig';
    }

    getObject(): Observable<ActiveConfig> {
        return this.http.get<JsonActiveConfig>(this.url, { headers: super.getHeaders() }).pipe(
            map((jsonActiveConfig: JsonActiveConfig) => this.mapper.toObject(jsonActiveConfig)),
            catchError((err) => this.handleError(err))
        );
    }
}
