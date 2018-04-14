import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WalletListComponent} from './wallet-list.component';
import {WalletModule} from '../wallet/wallet.module';
import {WalletListService} from './wallet-list.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';

export const firebaseConfig = {
  apiKey: 'AIzaSyD7_PcT09_CBBp290jjAV8EqlKkbta811g',
  authDomain: 'wallet-113a4.firebaseapp.com',
  databaseURL: 'https://wallet-113a4.firebaseio.com',
  projectId: 'wallet-113a4',
  storageBucket: 'wallet-113a4.appspot.com',
  messagingSenderId: '760746840753'
};

@NgModule({
  imports: [
    CommonModule,
    WalletModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [WalletListComponent],
  exports: [WalletListComponent],
  providers: [WalletListService]
})
export class WalletListModule {
}
