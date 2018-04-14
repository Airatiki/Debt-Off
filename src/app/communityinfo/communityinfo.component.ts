import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {FormBuilder} from '@angular/forms';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {MatDialog} from '@angular/material';
import {GraphComponent} from '../graph/graph.component';
import {User} from '../shared/User';
import {CommunityInfo} from '../shared/CommunityInfo';

@Component({
  selector: 'app-communityinfo',
  templateUrl: './communityinfo.component.html',
  styleUrls: ['./communityinfo.component.css']
})
export class CommunityinfoComponent implements OnInit {
  displayedColumns = ['avatar', 'firstName', 'userName'];
  dataSource: MembersDataSource;
  community: CommunityInfo;
  members: User[];
  isCommunity = false;
  toJoin = false;
  constructor(private route: ActivatedRoute, private router: Router,
              private userservice: UserService, private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      window.location.href = 'http://localhost:4200';
      // window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.route.params.switchMap((params: Params) => {
      this.userservice.getCommunityInfo(params['id']).subscribe(communityInfo => {
        this.initCommunity(communityInfo);
      },
          error => {
          this.userservice.searchEntries(params['name'], 'community').subscribe(data => {
            const filteredCommunity = data.communities.filter(x => x.id.toString() === params['id']);
            if (filteredCommunity.length > 0) {
              this.toJoin = true;
              this.community = filteredCommunity[0];
            }
          });
        });
      return params['id'];
    }).subscribe(() => {});
  }

  initCommunity(communityInfo) {
    this.community = communityInfo;
    this.members = this.community.members;
    this.dataSource = new MembersDataSource(this.members);
    this.isCommunity = true;
  }

  leave() {
    this.userservice.leaveCommunity(this.community.id).subscribe(response => {
      this.router.navigate(['/home/communities'], { relativeTo: this.route });
    });
  }

  join() {
    this.userservice.joinCommunity(this.community.id).subscribe(() => {
      this.toJoin = false;
      this.ngOnInit();
    });
  }

  showGraph() {
    const dialogRef = this.dialog.open(GraphComponent);
    const instance = dialogRef.componentInstance;
    instance.community = this.community;
  }

  onUserClick(user) {
    this.router.navigate(['/home/userinfo/' + user.id], { relativeTo: this.route });
  }

  vkNavigate(event, id: number) {
    event.stopPropagation();
    window.open(
      `https://vk.com/${id}`,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

}

export class MembersDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private members: User[]) {
    super();
  }

  connect(): Observable<User[]> {
    return Observable.of(this.members);
  }

  disconnect() {}
}
