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
  userok = {'info':
    {'id': 4,
      'firstName': 'Airat',
      'lastName': 'Bikbaev',
      'userName': 'airatiki1488',
      'email': 'bikbaev.airat@gmail.com',
      'avatarUri': 'https://www.gravatar.com/avatar/1cdfa19b0e8fb34ced5bb33dce46e30b.jpg?d=identicon'},
    'requisites': []};

  user: any = {};
  isUser = false;
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
        console.log(data);
        this.user = data.json();
        this.isUser = true;
        console.log(this.user);
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
