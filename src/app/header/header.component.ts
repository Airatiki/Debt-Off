import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {LoginComponent} from '../login/login.component';

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

}
