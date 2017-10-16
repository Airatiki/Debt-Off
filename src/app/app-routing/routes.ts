import { Routes } from '@angular/router';

import { HeaderComponent} from '../header/header.component';
import { HomeComponent } from '../home/home.component';
import { DebtComponent } from '../debt/debt.component';
import {UserinfoComponent} from "../userinfo/userinfo.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'home/debts', component: DebtComponent },
  {path: 'home/userinfo/:id', component: UserinfoComponent},
  {path: '', redirectTo: '/header', pathMatch: 'full'}
];
