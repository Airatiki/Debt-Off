import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUserSelf() {
    return this.http.get('https://debtoff.azurewebsites.net/api/user/self', this.jwt());
  }
  getUserSummary() {
    return this.http.get('https://debtoff.azurewebsites.net/api/loan/summary', this.jwt());
  }
  getUserHistory(id) {
    console.log('LIZA ++++++', id);
    return this.http.get('https://debtoff.azurewebsites.net/api/loan/user/' + id, this.jwt());
  }
  getUserInfo(id) {
    console.log('LIZA ++++++', id);
    return this.http.get('https://debtoff.azurewebsites.net/api/user/' + id, this.jwt());
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
