import { Component, OnInit } from '@angular/core';
import { User } from '../shared/User';
import {UserService} from '../services/user.service';
import {NavbarService} from '../services/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NavbarService ]
})
export class HomeComponent implements OnInit {

  user: any = {};
  constructor(private userservice: UserService, public nav: NavbarService) { }

  ngOnInit() {
    this.load().subscribe(_ => {
      console.log(this.user);
    });
    this.nav.show();

  }

  load() {
    return this.userservice.getUserSelf().map(
      data => {
        console.log(this.user);
        this.user = data;
      },
      error => {

      }
    );

  }

  logout() {
    localStorage.removeItem('currentUser');
    console.log(localStorage.getItem('currentUser'));
  }

}
