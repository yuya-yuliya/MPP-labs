import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private url = environment.apiUrl + "api/users/";
  private tokenKey = "token";

  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  signin(user: User) {
    return this.http.post<any>(`${this.url}signin`, user).pipe(
      map(data => {
        if (data && data.token) {
          localStorage.setItem(this.tokenKey, data.token);
        }

        return data;
      })
    );
  }

  signup(user: User): Observable<Object> {
    return this.http.post(`${this.url}signup`, user);
  }

  signout() {
    localStorage.removeItem(this.tokenKey);
  }
}
