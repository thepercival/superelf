import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { UserMapper, JsonUser } from '../user/mapper';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends APIRepository {
  private auth: JsonAuth | undefined;

  constructor(private userMapper: UserMapper, private http: HttpClient) {
    super();
    const authFromStorage = localStorage.getItem('auth');
    authFromStorage ? this.setAuth(JSON.parse(authFromStorage)) : this.clearAuthItem();
  }

  isLoggedIn(): boolean {
    return this.auth !== undefined;
  }

  getUser(): User | undefined {
    return this.auth ? this.userMapper.toObject(this.auth.user) : undefined;
  }

  protected clearAuthItem() {
    this.auth = undefined;
    localStorage.removeItem('auth');
  }

  setAuth(jsonAuth: JsonAuth): boolean {
    this.auth = jsonAuth;
    localStorage.setItem('auth', JSON.stringify(this.auth));
    return true;
  }

  getUrl(): string {
    return super.getApiUrl() + 'auth';
  }

  register(emailaddress: string, name: string, password: string): Observable<void> {
    const jsonUser = {
      emailaddress, name, password
    };
    return this.http.post(this.getUrl() + '/register', jsonUser, { headers: super.getHeaders() }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  validate(emailaddress: string, key: string): Observable<boolean> {
    return this.http.post<JsonAuth>(this.getUrl() + '/validate', { emailaddress, key }, { headers: super.getHeaders() }).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    );
  }


  extendToken() {
    this.http.post<JsonAuth>(this.getUrl() + '/extendtoken', undefined, { headers: super.getHeaders() }).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    ).subscribe();
  }

  // activate( email: string, activationkey : string ): Observable<boolean> {
  //   return this.http.post( this.url + '/activate', { email: email, activationkey: activationkey })
  //       .map((response: Response) => response.text() )
  //       .catch(this.handleError);
  // }

  login(emailaddress: string, password: string): Observable<boolean> {
    const json = { emailaddress: emailaddress, password: password };
    return this.http.post<JsonAuth>(this.getUrl() + '/login', json, this.getOptions()).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    );
  }

  passwordReset(email: string): Observable<boolean> {
    const json = { emailaddress: email };
    return this.http.post(this.getUrl() + '/passwordreset', json, this.getOptions()).pipe(
      map((res: any) => {
        return res.retval;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  passwordChange(emailaddress: string, password: string, code: string): Observable<boolean> {
    const json = { emailaddress: emailaddress, password: password, code: code };
    return this.http.post<JsonAuth>(this.getUrl() + '/passwordchange', json, this.getOptions()).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    );
  }

  logout(): void {
    this.clearAuthItem();
  }
}

interface JsonAuth {
  token: string;
  user: JsonUser;
}