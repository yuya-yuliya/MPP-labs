import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let currentToken = this.userService.token;
    if (currentToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentToken}`
        }
      });
    }

    return next.handle(request);
  }
}
