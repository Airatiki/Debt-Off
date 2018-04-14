import { Routes } from '@angular/router';

import { HeaderComponent} from '../header/header.component';
import { HomeComponent } from '../home/home.component';
import { DebtComponent } from '../debt/debt.component';
import {UserinfoComponent} from '../userinfo/userinfo.component';
import {SearchComponent} from '../search/search.component';
import {CommunityComponent} from '../community/community.component';
import {CommunityinfoComponent} from '../communityinfo/communityinfo.component';
import {NotificationComponent} from '../notification/notification.component';
import {WalletListComponent} from '../wallet-list/wallet-list.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'home/debts', component: DebtComponent },
  {path: 'home/search', component: SearchComponent},
  {path: 'home/communities', component: CommunityComponent },
  {path: 'home/userinfo/:id', component: UserinfoComponent},
  {path: 'home/notifications', component: NotificationComponent},
  {path: 'home/wallets', component: WalletListComponent},
  {path: 'home/communityinfo/:id/:name', component: CommunityinfoComponent},
  {path: '', redirectTo: '/header', pathMatch: 'full'}
];
