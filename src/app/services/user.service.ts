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

  getUsers() {
    return this.http.get('https://debtoff.azurewebsites.net/api/user/search', this.jwt());
  }

  getCommunityInfo(id) {
    return this.http.get('https://debtoff.azurewebsites.net/api/community/' + id, this.jwt());
  }
  getCommunities() {
    return this.http.get('https://debtoff.azurewebsites.net/api/community', this.jwt());
  }
  getNotifications() {
    return this.http.get('https://debtoff.azurewebsites.net/api/invoice/user', this.jwt());
  }
  acceptInvoice(id: number) {
    return this.http.post('https://debtoff.azurewebsites.net/api/invoice/accept/' + id,
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }

  searchCommunities() {
    return this.http.get('https://debtoff.azurewebsites.net/api/community/search', this.jwt());
  }
  joinCommunity(id: number) {
    return this.http.post('https://debtoff.azurewebsites.net/api/community/' + id + '/join',
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }
  optimizeCommunity(id: number) {
    return this.http.post('https://debtoff.azurewebsites.net/api/community/' + id + '/optimize',
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }
  createCommunity(name: string) {
    return this.http.post('https://debtoff.azurewebsites.net/api/community',
      JSON.stringify({name: name}),
      this.postJWT()).map((response: Response) => {
      console.log(response);
    });
  }


  createDebt(creditorId: number, description: string, amount: number) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentUser});
      const options = new RequestOptions({headers: headers});
      return this.http.post('https://debtoff.azurewebsites.net/api/loan/user/' + creditorId,
        JSON.stringify({description: description, amount: amount, time: (new Date()).toISOString()}),
        options)
        .map((response: Response) => {
          // login successful if there's a jwt token in the response
          // const user = response.json();
          // console.log(user);
          console.log(response);
        });
    }
  }

  private postJWT() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentUser});
      return new RequestOptions({headers: headers});
    }
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
