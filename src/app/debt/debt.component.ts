import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../services/navbar.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css'],
  providers: [NavbarService ]
})
export class DebtComponent implements OnInit {
  model: any = {};

  constructor(public nav: NavbarService, private userservice: UserService ) { }

  ngOnInit() {
    this.getSummary().subscribe( _ => {
      console.log(this.model);
    });
    this.nav.show();
  }

  getSummary() {
    return this.userservice.getUserSummary().map(
      data => {
        console.log(data);
        this.model = data;
      },
      error => {

      }
    );
  }

}
