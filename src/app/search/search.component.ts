import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {User} from '../shared/User';
import {Community} from '../shared/Community';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searching = [
    {value: 'user', viewValue: 'Люди'},
    {value: 'community', viewValue: 'Сообщества'}
  ];
  dataLoaded= true;
  isUserShown = true;
  resultsUser: User[];
  resultsCommunity: Community[];
  searchTerm$ = new Subject<string>();

  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) {
    this.search(this.searchTerm$, this.searching[0].value).subscribe(results => {
      this.resultsUser = results.users;
      this.dataLoaded = true;
    });

  }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      window.location.href = 'http://localhost:4200';
      // window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
  }

  search(terms: Observable<string>, entity) {

    return terms.debounceTime(400)
      .distinctUntilChanged()
      .filter((str) => str.length > 0)
      .switchMap((term) => {
        this.dataLoaded = false;
        return this.userservice.searchEntries(term, entity); });
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
      this.search(this.searchTerm$, this.searching[0].value).subscribe(results => {
        this.resultsUser = results.users;
        this.dataLoaded = true;
      });
    } else {
      this.search(this.searchTerm$, this.searching[1].value).subscribe(results => {
        this.resultsCommunity = results.communities;
        this.dataLoaded = true;
      });
    }
  }

  toggle() {
    this.isUserShown = !this.isUserShown;
  }
}
