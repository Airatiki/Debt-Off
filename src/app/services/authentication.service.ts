import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {User} from '../shared/User';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  login(email: string, password: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post('https://debtoff.azurewebsites.net/api/Account/token', JSON.stringify({ email: email, password: password }),
      options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        // const user = response.json();
        // console.log(user);
        console.log(response);
        if (response) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', response.text());
        }
      });
  }

  create(user: User) {
    return this.http.post('https://debtoff.azurewebsites.net/api/Account/register', user).map((response: Response) => response.json());
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
