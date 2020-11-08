import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Pool } from '../pool';
import { APIRepository } from '../repository';
import { JsonPool } from './json';
import { PoolMapper } from './mapper';


@Injectable()
export class PoolRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: PoolMapper) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pools';
    }

    getUrl(pool?: Pool): string {
        return this.url + (pool ? ('/' + pool.getId()) : '');
    }

    getObject(id: number): Observable<Pool> {
        const url = super.getApiUrl() + (this.getToken() === undefined ? 'public/' : '') + this.getUrlpostfix() + '/' + id;
        return this.http.get<JsonPool>(url, { headers: super.getHeaders() }).pipe(
            map((jsonPool: JsonPool) => this.mapper.toObject(jsonPool)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonPool): Observable<Pool> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonPool: JsonPool) => this.mapper.toObject(jsonPool)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(pool: Pool): Observable<Pool> {
        const url = this.getUrl(pool);
        return this.http.put(url, this.mapper.toJson(pool), { headers: super.getHeaders() }).pipe(
            map((res: JsonPool) => {
                return this.mapper.toObject(res);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(pool: Pool): Observable<boolean> {
        const url = this.getUrl(pool);
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res) => true),
            catchError((err) => this.handleError(err))
        );
    }

    getJoinUrl(pool: Pool): Observable<string> {
        const baseUrl = super.getApiUrl() + this.getUrlpostfix() + '/' + pool.getId();
        return this.http.get(baseUrl + '/joinurl', { headers: super.getHeaders() }).pipe(
            map((json: any) => json.url),
            catchError((err) => this.handleError(err))
        );
    }

    join(pool: Pool, key: string): Observable<void> {
        const baseUrl = super.getApiUrl() + this.getUrlpostfix() + '/' + pool.getId();
        return this.http.post(baseUrl + '/join', { key }, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }
}




