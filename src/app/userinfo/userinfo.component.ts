import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import 'rxjs/add/operator/switchMap';
import {MdPaginator} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  displayedColumns = ['Description', 'Date', 'Amount'];
  database: any;
  dataSource: ExampleDataSource | null;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(private route: ActivatedRoute, private userservice: UserService) { }
  user: any = {};
  isUser = false;
  ngOnInit() {
    this.database = new ExampleDatabase(this.userservice, this.route);
    this.dataSource = new ExampleDataSource(this.database, this.paginator);

    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserInfo(params['id']).subscribe(data => {
        this.user = data.json();
        this.isUser = true;
        console.log(this.user);
      });
      console.log(params['id'], 'petuh');
      return params['id'];
    }).subscribe(_ => {});
    console.log(this.user);
  }

}

let lolans: any = {};
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }
  user: any = {};
  constructor(private userservice: UserService, private route: ActivatedRoute) {
    console.log('EXAMPLE START, LOANS ');

    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserHistory(params['id']).subscribe(data => {
        console.log('PIDRILA = ', data.json());
        this.user = data.json();
        this.addDebts(data.json());
        console.log(this.user);
      });
      console.log(params['id'], 'petuh');
      return params['id'];
    }).subscribe(_ => {});
    console.log(this.user);
    // console.log(loans);
    // this.isCredit ? this.addCredits() : this.addDebts();
  }

  addDebts(user) {

    console.log('SUCHARA');
    for (let i = 0; i < user.credits.length; i++){
      const copiedData = this.data.slice();
      copiedData.push(this.createNewUser(user.credits[i], 'green'));
      this.dataChange.next(copiedData);
    }
    for ( let i = 0; i < user.debts.length; i++) {
      const copiedData = this.data.slice();
      copiedData.push(this.createNewUser(user.debts[i], 'red'));
      this.dataChange.next(copiedData);
    }
  }

  private createNewUser(item, color) {
    console.log('MASHINA = ', item);
    return {
      time: item.time,
      description: item.description,
      amount: item.amount,
      color: color
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  constructor(private _creditsDatabase: ExampleDatabase, private _creditsPaginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._creditsDatabase.dataChange,
      this._creditsPaginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._creditsDatabase.data.slice();

      // Grab the page's slice of data.
      const startIndex = this._creditsPaginator.pageIndex * this._creditsPaginator.pageSize;
      return data.splice(startIndex, this._creditsPaginator.pageSize);
    });
  }

  disconnect() {}
}

