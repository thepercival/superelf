import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIRepository } from '../../repository';

@Injectable()
export class PoolShellRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient) {
        super();
    }

    getUrlpostfix(withRole: boolean): string {
        return 'shells' + (withRole ? 'withrole' : '');
    }

    getUrl(withRole: boolean): string {
        return super.getApiUrl() + (this.getToken() === undefined ? 'public/' : '') + this.getUrlpostfix(withRole);
    }

    getObjects(filter?: PoolShellFilter): Observable<PoolShell[]> {
        const options = {
            headers: super.getHeaders(),
            params: this.getHttpParams(filter)
        };
        const withRole: boolean = filter ? filter.roles > 0 : false;
        return this.http.get<PoolShell[]>(this.getUrl(withRole), options).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    private getHttpParams(filter?: PoolShellFilter): HttpParams {
        let httpParams = new HttpParams();
        if (filter === undefined) {
            return httpParams;
        }
        if (filter.startDate !== undefined) {
            httpParams = httpParams.set('startDate', filter.startDate.toISOString());
        }
        if (filter.endDate !== undefined) {
            httpParams = httpParams.set('endDate', filter.endDate.toISOString());
        }
        if (filter.name !== undefined) {
            httpParams = httpParams.set('name', filter.name);
        }
        if (filter.roles !== undefined) {
            httpParams = httpParams.set('roles', '' + filter.roles);
        }
        return httpParams;
    }
}

export interface PoolShell {
    poolId: number;
    name: string;
    seasonName: string;
    roles: number;
}

export interface PoolShellFilter {
    startDate?: Date;
    endDate?: Date;
    name?: string;
    roles?: number;
}
