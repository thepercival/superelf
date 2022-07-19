import { HttpParams } from '@angular/common/http';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError as observableThrowError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export class APIRepository {

    protected apiurl: string = environment.apiurl;
    private apiVersion: string = environment.apiVersion;
    private appErrorHandler: AppErrorHandler;

    constructor() {
        this.appErrorHandler = new AppErrorHandler();
    }

    getApiUrl(): string {
        return this.apiurl;
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        headers = headers.append('X-Api-Version', this.apiVersion);

        const token = this.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    protected getToken(): string {
        const localStorageAuth = localStorage.getItem('auth');
        const auth = localStorageAuth !== null ? JSON.parse(localStorageAuth) : undefined;
        return auth?.token;
    }

    protected getOptions(): { headers: HttpHeaders; params: HttpParams } {
        return {
            headers: this.getHeaders(),
            params: new HttpParams()
        };
    }

    protected handleError(error: HttpErrorResponse | Error): Observable<any> {
        return this.appErrorHandler.handleError(error);
    }
}

export class AppErrorHandler {
    public handleError(error: HttpErrorResponse | Error): Observable<any> {
        let errortext: string = 'onbekende fout(';
        if (!navigator.onLine) {
            errortext = 'er kan geen internet verbinding gemaakt worden';
        } else if (error instanceof HttpErrorResponse) {
            console.log(error);
            if (error.status === 0) {
                errortext = 'er kan geen verbinding met de data-service gemaakt worden, ververs de pagina';
            } else if (error.status === 401) {
                if (error.error && error.error.message === 'Expired token') {
                    errortext = 'de sessie is verlopen, log uit en log daarna opnieuw in';
                } else {
                    errortext = 'je hebt geen rechten om de aanvraag te doen, waarschijnlijk is je sessie verlopen, log dan opnieuw in';
                }
            } else if (error.error) {
                if (typeof error.error === 'string') {
                    errortext = error.error;
                } else if (error.error.message) {
                    errortext = error.error.message;
                }
            } else if (error && error.message) {
                errortext = error.message;
            }
        }
        else if (typeof error === 'string') {
            errortext = error;
        }
        else {
            errortext = error.message;
        }
        const err = new Error(errortext);
        return throwError(() => err);
    }
}