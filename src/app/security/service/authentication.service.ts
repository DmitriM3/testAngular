import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {catchError, filter, tap} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../../domain/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private resourceUrl: string = environment.backendUrl + "login";
  private _loggedIn: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(public http: HttpClient,
              public router: Router) {
  }

  get loggedIn(): Observable<User | null> {
    return this._loggedIn.asObservable().pipe(filter(user => user !== null));
  }

  isLoggedIn(): boolean {
    const token = this.token;
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      if (this._loggedIn.value === null)
        this._loggedIn.next(new User(this.jwtHelper.decodeToken(token).username));
      return true;
    }
    return false;
  }

  get token(): string | null {
    return localStorage.getItem(environment.tokenName);
  }

  login(username: string, password: string): Observable<any> {
    const login = {
      username: username,
      password: password
    };
    return this.http.post<any>(this.resourceUrl, login).pipe(
      catchError(error => {
        let errorMsg: string;
        switch (error.status) {
          case 401:
            errorMsg = "Usuario y/o contraseña invalido";
            break;
          default:
            errorMsg = "Error interno del servidor"
        }
        return throwError(errorMsg);
      }), tap(response => {
        localStorage.setItem(environment.tokenName, response.token);
        let decodeToken = this.jwtHelper.decodeToken(response.token);
        let user: User = new User(decodeToken.username);
        this._loggedIn.next(user);
      }));
  }

  logout() {
    this._loggedIn.next(null);
    localStorage.removeItem(environment.tokenName);
    return this.router.navigate(['login']);
  }
}
