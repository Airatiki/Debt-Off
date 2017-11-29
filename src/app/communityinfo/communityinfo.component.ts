import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {FormBuilder} from '@angular/forms';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-communityinfo',
  templateUrl: './communityinfo.component.html',
  styleUrls: ['./communityinfo.component.css']
})
export class CommunityinfoComponent implements OnInit {
  displayedColumns = ['avatar', 'firstName', 'userName'];
  dataSource: ExampleDataSource;
  community: any = {};
  members: any= [];
  isCommunity = false;
  toJoin = false;
  constructor(private route: ActivatedRoute, private router: Router, private userservice: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.route.params.switchMap((params: Params) => {
      this.userservice.getCommunityInfo(params['id']).subscribe(data => {
        this.initCommunity(data.json());
      },
          error => {
          console.log(params['id'], params['name']);
          this.userservice.searchEntries(params['name'], 'community').subscribe(data => {
            const filteredCommunity = data.communities.filter(x => x.id.toString() === params['id']);
            if (filteredCommunity.length > 0) {
              this.toJoin = true;
              this.community = filteredCommunity[0];
            }
          });
        console.log('ERROR');
        });
      console.log(params['id'], 'petuh');
      return params['id'];
    }).subscribe(() => {});
    console.log(this.community);
  }

  initCommunity(data) {
    this.community = data;
    this.members = this.community.members;
    memb = this.community.members;
    this.dataSource = new ExampleDataSource();
    this.isCommunity = true;
  }

  leave() {
    this.userservice.leaveCommunity(this.community.id).subscribe(response => {
      console.log(response);
      this.router.navigate(['/home/communities'], { relativeTo: this.route });
    });
  }

  join() {
    this.userservice.joinCommunity(this.community.id).subscribe(() => {
      this.toJoin = false;
      this.ngOnInit();
    });
  }

  optimize() {
    this.userservice.optimizeCommunity(this.community.id).subscribe(response => {
      console.log(response);
    });
  }

  onUserClick(user) {
    this.router.navigate(['/home/userinfo/' + user.id], { relativeTo: this.route });
  }

}

let memb = [];

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(memb);
  }

  disconnect() {}
}
