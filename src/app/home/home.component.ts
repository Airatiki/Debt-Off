import {Component, ElementRef, OnInit} from '@angular/core';
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

  user: User;
  isUser = false;
  constructor(private route: ActivatedRoute, private router: Router,
              private userservice: UserService, public nav: NavbarService,
              private el: ElementRef) { }

  ngOnInit() {
    if (window.location.href.indexOf('token') !== -1) {
      const equalSign = window.location.href.indexOf('=');
      localStorage.setItem('currentUser', window.location.href.substring(equalSign + 1, window.location.href.length));
      this.router.navigate(['/home/debts'], { relativeTo: this.route });
    }
    this.loadUser();
    this.nav.show();
    if (localStorage.getItem('currentUser') === null) {
      window.location.href = 'http://localhost:4200';
      // window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
  }

  onMenuClick({view}) {
    if (view.innerWidth < 768) {
      this.el.nativeElement.querySelector('.navbar-toggle').click();
    }
  }

  loadUser() {
    this.userservice.getUserSelf().subscribe(user => {
      localStorage.setItem('userEmail', user.info.email);
      this.user = user.info;
      this.isUser = true;
    });
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
