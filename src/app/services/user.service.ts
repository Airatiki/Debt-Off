import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUserSelf() {
    return this.http.get('https://debtoff.azurewebsites.net/api/user/self', this.jwt()).map((response: Response) => response.json());
  }
  getUserSummary() {
    console.log(localStorage.getItem('currentUser'));
    console.log(this.jwt());
    return this.http.get('https://debtoff.azurewebsites.net/api/loan/summary', this.jwt());
  }


  private jwt() {
    // create authorization header with jwt token
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser });
      return new RequestOptions({ headers: headers });
    }
  }


}
