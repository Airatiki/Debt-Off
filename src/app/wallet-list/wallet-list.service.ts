import {Injectable} from '@angular/core';
import {User, Wallet} from '../../model/wallet';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../constants/baseUrl.const';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WalletListService {

  constructor(private http: HttpClient) {
  }

  getWallets(wallets: string[]): Observable<Wallet[]> {
    return this.http.get(`${BASE_URL}/wallets.json`)
      .map((data) => {
        return Object.entries(data)
          .filter(([id]) => wallets.indexOf(id) > -1)
          .map(([id, value]) => Object.assign(value, {id}));
      });
  }

  addWallet(wallet: Wallet): Observable<Wallet> {
    return this.http.post(`${BASE_URL}/wallets.json`, wallet);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get(`${BASE_URL}/users/${userId}.json`)
      .do(response => console.log(response, 'USER'));
  }

  addWalletToUser(userId: string, walletId: string) {
    return this.getUser(userId).subscribe((user: User) => {
      const newWallet = user.wallets ? [...user.wallets, walletId] : [walletId];
      const newUser = {...user, wallets: newWallet};
      return this.http.put(`${BASE_URL}/users/${userId}.json`, newUser).subscribe();
    });
  }

}
