import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
// import {MaterialModule} from '@angular/material';
import { HttpModule } from '@angular/http';

import {AuthenticationService} from './services/authentication.service';
import {UserService} from './services/user.service';
import { NavbarService} from './services/navbar.service';

import { AppRoutingModule} from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import 'hammerjs';
import { HomeComponent } from './home/home.component';
import { DebtComponent } from './debt/debt.component';
import {
  MatButtonModule,
  MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatToolbarModule,
  NoConflictStyleCompatibilityMode
} from '@angular/material';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { SearchComponent } from './search/search.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CommunityComponent } from './community/community.component';
import { CommunityinfoComponent } from './communityinfo/communityinfo.component';
import { NotificationComponent } from './notification/notification.component';
import { GraphComponent } from './graph/graph.component';
import {WalletListModule} from './wallet-list/wallet-list.module';
import {HttpClientModule} from '@angular/common/http';

import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    DebtComponent,
    UserinfoComponent,
    SearchComponent,
    CommunityComponent,
    CommunityinfoComponent,
    NotificationComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    WalletListModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    NoConflictStyleCompatibilityMode,
    ReactiveFormsModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [AuthenticationService, UserService, NavbarService, {provide: LOCALE_ID, useValue: 'ru'}],
  entryComponents: [LoginComponent, GraphComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
