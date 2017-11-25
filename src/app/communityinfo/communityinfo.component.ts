import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
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
  displayedColumns = ['firstName', 'userName', 'email'];
  dataSource: ExampleDataSource;
  community: any = {};
  members: any= [];
  isCommunity = false;
  constructor(private route: ActivatedRoute, private userservice: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.route.params.switchMap((params: Params) => {
      this.userservice.getCommunityInfo(params['id']).subscribe(data => {
        this.community = data.json();
        this.members = this.community.members;
        memb = this.community.members;
        this.dataSource = new ExampleDataSource();
        this.isCommunity = true;
        console.log('HUILOOO', this.community);
        console.log(this.members);
      });
      console.log(params['id'], 'petuh');
      return params['id'];
    }).subscribe(_ => {});
    console.log(this.community);
  }

  leave() {

  }
  optimize() {
    this.userservice.optimizeCommunity(this.community.id).subscribe(response => {
      console.log(response);
    });
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
