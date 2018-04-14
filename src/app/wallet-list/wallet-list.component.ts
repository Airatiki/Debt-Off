import {Component, OnInit} from '@angular/core';
import {WalletListService} from './wallet-list.service';
import {Wallet} from '../../model/wallet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css']
})
export class WalletListComponent implements OnInit {
  wallets: Wallet[];
  formCreated = false;
  showCreateButton = true;
  walletForm: FormGroup;
  walletToSubmit: Wallet;
  userId: string;
  isWalletLoaded = false;
  formErrors = {
    'name': '',
    'amount': ''
  };

  validationMessages = {
    'name': {
      'required': 'Обязательное поле.',
      'minlength': 'Поле должно содержать не менее 1 символов.',
      'maxlength': 'Поле должно содержать менее 25 символов.'
    },
    'amount': {
      'required': 'Обязательное поле',
      'pattern': 'Поле должно содержать только цифры'
    }
  };
  USER = {
    email: 'test__' + localStorage.getItem('userEmail'),
    password: 'qwerty123'
  };

  constructor(private walletListService: WalletListService,
              private fb: FormBuilder,
              private af: AngularFireDatabase,
              private firebaseAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.signUp();
  }

  private getWallets() {
    this.walletListService.getUser(this.userId)
      .subscribe(user => {
        if (!user.wallets) {
          this.isWalletLoaded = true;
          return;
        }
        if (user.wallets) {
          this.walletListService.getWallets(user.wallets)
            .subscribe((wallets) => {
              this.wallets = wallets;
              this.isWalletLoaded = true;
            });
        }
      });
  }

  private signUp() {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(this.USER.email, this.USER.password)
      .then(value => {
        this.userId = value.uid;
        this.af.database.ref(`users/${value.uid}`).set({
          email: value.email,
          wallets: []
        });
      })
      .catch(err => {
        this.login(this.USER.email, this.USER.password);
      });
  }

  private login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.userId = value.uid;
        console.log('Nice, it worked!', value);
        this.getWallets();
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  createWallet() {
    this.createForm();
    this.showCreateButton = false;
  }

  createForm() {
    this.formCreated = true;
    this.walletForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      amount: ['', [Validators.required, Validators.pattern]],
    });

    this.walletForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.walletForm) { return; }
    const form = this.walletForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.walletToSubmit = this.walletForm.value;
    this.cancelButton();

    this.walletListService.addWallet(this.walletToSubmit)
      .subscribe(wallet => {
        console.log(wallet, 'WALLET');
        this.walletListService.addWalletToUser(this.userId, wallet.name);
      });
  }

  cancelButton() {
    this.formCreated = false;
    this.showCreateButton = true;
  }
}
