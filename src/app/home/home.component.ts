import { Component, OnInit } from '@angular/core';
import { User } from '../shared/User';
import {UserService} from '../services/user.service';
import {NavbarService} from '../services/navbar.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NavbarService ]
})


export class HomeComponent implements OnInit {

  user: any = {};
  isUser = false;
  constructor(private route: ActivatedRoute, private router: Router, private userservice: UserService, public nav: NavbarService) { }

  ngOnInit() {
    if (window.location.href.indexOf('token') !== -1) {
      const equalSign = window.location.href.indexOf('=');
      localStorage.setItem('currentUser', window.location.href.substring(equalSign + 1, window.location.href.length));
      this.router.navigate(['/home/debts'], { relativeTo: this.route });
    }
    this.load().subscribe(() => {
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
    // this.router.navigate(['/']);
    // window.location.href = 'http://localhost:4200';
    window.location.href = 'https://airatiki.github.io/Debt-Off/header';
    console.log(localStorage.getItem('currentUser'));

    localStorage.removeItem('currentUser');

    console.log(localStorage.getItem('currentUser'));
    // location.href = 'localhost:4200/header';
  }

}
