import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {LoginComponent} from '../login/login.component';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }
  openLoginForm() {
    this.dialog.open(LoginComponent, {hasBackdrop: true,
      backdropClass: 'myBackdrop',
      panelClass: 'myClass',
      width: '500px'});
  }
  vkReg() {
    // window.location.href = 'http://debtoff.azurewebsites.net/api/account/authenticate?state=http%3A%2F%2Flocalhost%3A4200%2Fhome';
    window.location.href = 'http://debtoff.azurewebsites.net/api/account/authenticate?state=https%3A%2F%2Fairatiki.github.io%2FDebt-Off%2Fhome';

  }

}
