import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  vkReg() {
    if (localStorage.getItem('currentUser') !== null) {
      // window.location.href = 'https://airatiki.github.io/Debt-Off/home/debts';
      window.location.href = 'http://localhost:4200/home/debts';
    } else {
      // window.location.href = 'http://debtoff.azurewebsites.net/api/account/' +
      //   'authenticate?state=https%3A%2F%2Fairatiki.github.io%2FDebt-Off%2Fhome';
      window.location.href = 'http://debtoff.azurewebsites.net/api/account/authenticate?state=http%3A%2F%2Flocalhost%3A4200%2Fhome';
    }


  }

}
