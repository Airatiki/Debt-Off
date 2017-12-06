import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {BASE_URL} from '../constants/baseUrl';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import {User, UserSummary} from '../shared/User';
import {Community} from '../shared/Community';
import {UserInfo} from '../shared/User';
import {NotificationStore} from '../shared/Notification';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUserSelf(): Observable<UserInfo> {
    return this.http.get(BASE_URL + '/user/self', this.jwt()).map(data => data.json());
  }
  getUserSummary(): Observable<UserSummary> {
    return this.http.get(BASE_URL + '/loan/summary', this.jwt()).map(data => data.json());
  }
  getUserHistory(id): Observable<any> {
    console.log('HISTORY', id);
    return this.http.get(BASE_URL + '/loan/user/' + id, this.jwt())
      .map(data => {
        const credits = data.json().credits.map(x => Object.assign({...x}, {color: '#28a745'}));
        const debts = data.json().debts.map(x => Object.assign({...x}, {color: '#dc3545'}));
        return credits.concat(debts).sort(function (a, b) {
          if (a.time > b.time) {
            return -1;
          } else if (a.time < b.time) {
            return 1;
          } else {
            return 0;
          }
        });
      });
  }

  searchEntries(term, entity) {
    return this.http
      .get(BASE_URL + `/${entity}/search?pattern=` + term, this.jwt())
      .map(res => res.json());
  }

  getUserInfo(id): Observable<User> {
    console.log('LIZA ++++++', id);
    return this.http.get(BASE_URL + '/user/' + id, this.jwt()).map(data => data.json().info);
  }

  getCommunityInfo(id) {
    return this.http.get(BASE_URL + '/community/' + id, this.jwt()).map(data => data.json());
  }
  getCommunities(): Observable<Community[]> {
    return this.http.get(BASE_URL + '/community', this.jwt()).map(data => data.json());
  }
  getNotifications(): Observable<NotificationStore> {
    return this.http.get(BASE_URL + '/invoice/user', this.jwt()).map(data => data.json());
  }
  acceptInvoice(id: number) {
    console.log(this.jwt());
    return this.http.post(BASE_URL + '/invoice/accept/' + id, {},
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }
  declineInvoice(id: number) {
    return this.http.post(BASE_URL + `/invoice/decline/${id}`, {},
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }

  joinCommunity(id: number) {
    return this.http.post(BASE_URL + '/community/' + id + '/join', {},
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }
  optimizeCommunity(id: number) {
    return this.http.post(BASE_URL + '/community/' + id + '/optimize', {},
      this.jwt()).map((response: Response) => {
      console.log(response);
    });
  }
  createCommunity(name: string) {
    return this.http.post(BASE_URL + '/community',
      JSON.stringify({name: name}),
      this.postJWT()).map((response: Response) => {
      console.log(response);
    });
  }

  leaveCommunity(id: number) {
    return this.http.post(BASE_URL + `/community/${id}/leave`, {}, this.jwt())
      .map((response: Response) => {
      console.log(response);
      });
  }

  showCommunityGraph(id: number) {
    return this.http.get(BASE_URL + `/community/${id}/graph`, this.jwt());
  }


  createDebt(creditorId: string, description: string, amount: number) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentUser});
      const options = new RequestOptions({headers: headers});
      return this.http.post(BASE_URL + '/loan/user/' + creditorId,
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

  createInvoice(debtorId: string, description: string, amount: number) {
    console.log(debtorId);
    return this.http.post(BASE_URL + '/invoice/' + debtorId,
      JSON.stringify({description: description, amount: amount, time: (new Date()).toISOString()}), this.postJWT())
      .map((response: Response) => {
      console.log('invooooice', response);
      });
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
