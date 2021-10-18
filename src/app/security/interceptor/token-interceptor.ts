import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn()) {
      req = req.clone({
        setHeaders: {
          "Authorization": this.authService.token != null ? this.authService.token : '',
        }
      });
    }
    return next.handle(req);
  }


}
