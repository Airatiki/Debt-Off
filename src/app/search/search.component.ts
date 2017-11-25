import {Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  communities: any[];
  users: any[];
  selectedUser: Object = {};
  selectedCommunity: Object = {};

  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getUsers();
    this.getCommunities();
  }

  getUsers() {
    this.userservice.getUsers()
      .subscribe(data => {
        this.users = data.json().users;
        console.log(this.users);
      }, error => {
        console.log(error);
      });
  }

  getCommunities() {
    this.userservice.searchCommunities()
      .subscribe(data => {
        this.communities = data.json().communities;
        console.log(this.users);
      }, error => {
        console.log(error);
      });
  }

  onChangeUser(user) {
    this.router.navigate(['/home/userinfo/' + user.id], { relativeTo: this.route });
  }

  onChangeCommunity(community) {
    this.userservice.joinCommunity(community.id).subscribe(data => {
      console.log(data);
      this.router.navigate(['/home/communityinfo/' + community.id], { relativeTo: this.route });
    },
      error => {
      console.log(error);
      });
  }

}
