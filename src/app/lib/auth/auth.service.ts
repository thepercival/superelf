import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { UserMapper, JsonUser } from '../user/mapper';
import { User } from '../user';

@Injectable()
export class AuthService extends APIRepository {
  private auth: JsonAuth;

  constructor(private userMapper: UserMapper, private http: HttpClient) {
    super();
    const jsonAuth = JSON.parse(localStorage.getItem('auth'));
    jsonAuth ? this.setAuth(jsonAuth) : this.clearAuthItem();
  }

  isLoggedIn(): boolean {
    return this.auth !== undefined;
  }

  getUser(): User {
    return this.userMapper.toObject(this.auth.user);
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

  getPublicUrl(): string {
    return super.getApiUrl() + 'public/auth';
  }

  register(emailaddress: string, name: string, password: string): Observable<void> {
    const jsonUser = {
      emailaddress, name, password
    };
    return this.http.post(this.getPublicUrl() + '/register', jsonUser, { headers: super.getHeaders() }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  validate(emailaddress: string, key: string): Observable<boolean> {
    return this.http.post(this.getPublicUrl() + '/validate', { emailaddress, key }, { headers: super.getHeaders() }).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    );
  }


  extendToken() {
    this.http.post(this.getUrl() + '/extendtoken', undefined, { headers: super.getHeaders() }).pipe(
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
    return this.http.post(this.getPublicUrl() + '/login', json, this.getOptions()).pipe(
      map((jsonAuth: JsonAuth) => this.setAuth(jsonAuth)),
      catchError((err) => this.handleError(err))
    );
  }

  passwordReset(email: string): Observable<boolean> {
    const json = { emailaddress: email };
    return this.http.post(this.getPublicUrl() + '/passwordreset', json, this.getOptions()).pipe(
      map((res: any) => {
        return res.retval;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  passwordChange(emailaddress: string, password: string, code: string): Observable<boolean> {
    const json = { emailaddress: emailaddress, password: password, code: code };
    return this.http.post(this.getPublicUrl() + '/passwordchange', json, this.getOptions()).pipe(
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