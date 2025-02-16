import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIRepository } from '../../repository';
import { User } from '../../user';

@Injectable({
    providedIn: 'root'
})
export class PoolShellRepository extends APIRepository {

    constructor(
        private http: HttpClient) {
        super();
    }

    // getUrlpostfix(withRole: boolean): string {
    //     return 'shells' + (withRole ? 'withrole' : '');
    // }

    getUrl(user?: User): string {
        if( user ) {
          return super.getApiUrl() + "users/" + user.getId() + "/shells";
        }
        return super.getApiUrl() + "shells";
    }

    canCreateAndJoinPool(): Observable<number> {
        return this.http.get<number>(super.getApiUrl() + 'public/poolActions', { headers: super.getHeaders() }).pipe(
            catchError((err: Error) => this.handleError(err))
        );
    }

    getObjects(user?: User, filter?: PoolShellFilter): Observable<PoolShell[]> {
        const options = {
            headers: super.getHeaders(),
            params: this.getHttpParams(filter)
        };
        return this.http
          .get<PoolShell[]>(this.getUrl(user), options)
          .pipe(catchError((err: Error) => this.handleError(err)));
    }

    private getHttpParams(filter?: PoolShellFilter): HttpParams {
        let httpParams = new HttpParams();
        if (filter === undefined) {
            return httpParams;
        }
        if (filter.seasonId !== undefined) {
            httpParams = httpParams.set('seasonId', filter.seasonId);
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
    nrOfUsers?: number;
}

export interface PoolShellFilter {
    seasonId?: string|number;
    name?: string;
    roles?: number;
}
