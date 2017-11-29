import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searching = [
    {value: 'Users', viewValue: 'Users'},
    {value: 'Communities', viewValue: 'Communities'}
  ];
  isUserShown = true;
  resultsUser: any[];
  resultsCommunity: any[];
  searchTerm$ = new Subject<string>();

  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) {
    this.userservice.searchUsers(this.searchTerm$).subscribe(results => this.resultsUser = results.users);
  }

  ngOnInit() {

  }

  onUserClick(user) {
    this.router.navigate(['/home/userinfo/' + user.id], { relativeTo: this.route });
  }

  onCommunityClick(community) {
    this.router.navigate([`/home/communityinfo/${community.id}/${community.name}`], { relativeTo: this.route });
  }

  onSelectChange(target) {
    this.searchTerm$.complete();
    this.searchTerm$ = new Subject<string>();
    this.toggle();

    if (target === this.searching[0].value) {
      this.userservice.searchUsers(this.searchTerm$).subscribe(results => this.resultsUser = results.users);
    } else {
      this.userservice.searchCommunity(this.searchTerm$).subscribe(results => this.resultsCommunity = results.communities);
    }
  }

  toggle() {
    this.isUserShown = !this.isUserShown;
  }

}
