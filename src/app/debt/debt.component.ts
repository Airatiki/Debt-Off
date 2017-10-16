import { Component, OnInit, ViewChild } from '@angular/core';
import {NavbarService} from '../services/navbar.service';
import {UserService} from '../services/user.service';
import {DataSource} from '@angular/cdk/collections';
import {MdPaginator} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css'],
  providers: [NavbarService ]
})


export class DebtComponent implements OnInit {


  displayedColumns = ['avatar', 'FirstName', 'LastName', 'userName', 'amount'];

  creditsDatabase: any;
  debtsDatabase: any;
  dataCredits: ExampleDataSource | null;
  dataDebts: ExampleDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('debtsPaginator') debtsPaginator: MdPaginator;
  // @ViewChild(MdPaginator) debtsPaginator: MdPaginator;
  totalCreditsAmount: number;
  totalDebtsAmount: number;
  kek: number;
  model: any = {};

  constructor(public nav: NavbarService, private userservice: UserService ) { }

  ngOnInit() {
    this.debtsDatabase = new ExampleDatabase(this.userservice, false);
    this.dataDebts = new ExampleDataSource(this.debtsDatabase, this.debtsPaginator);


    this.creditsDatabase = new ExampleDatabase(this.userservice, true);
    this.dataCredits = new ExampleDataSource(this.creditsDatabase, this.paginator);
    this.kek  = 100;
    // console.log(this.debts.credits[0].user);
    // this.getSummary().subscribe( _ => {
    //   console.log(this.model);
    //   this.totalCreditsAmount = 0;
    //   this.totalDebtsAmount = 0;
    //   lolans.debts.forEach(item => this.totalDebtsAmount += item.totalAmount);
    //   lolans.credits.forEach(item => this.totalCreditsAmount += item.totalAmount);
    // });
    console.log('NGONINIT');

    console.log('pidrila');
    console.log(loans);

    // this.nav.show();
  }

  // getSummary() {
  //   return this.userservice.getUserSummary().map(
  //     data => {
  //       console.log(data);
  //       this.model = data;
  //       loans = data.json();
  //       console.log('LOANS DOWNLOADED');
  //       console.log(loans);
  //     },
  //     error => {
  //
  //     }
  //   );
  // }

}

let loans: any = {};
let lolans: any = {};


export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(private userservice: UserService, private isCredit: boolean) {
    console.log('EXAMPLE START, LOANS ');
    // console.log(loans);
    this.isCredit ? this.addCredits() : this.addDebts();
  }

  addDebts() {
    console.log('SUCHARA');
    this.userservice.getUserSummary().subscribe(data => {
      lolans = data.json();
      for (let i = 0; i < lolans.debts.length; i++) {
        const copiedData = this.data.slice();
        copiedData.push(lolans.debts[i]);
        this.dataChange.next(copiedData);
      }
    });

  }
  /** Adds a new user to the database. */
  // TODO: Add error checking
  addCredits() {
    console.log('SUCHARA');
    this.userservice.getUserSummary().subscribe(data => {
      lolans = data.json();
      for (let i = 0; i < lolans.credits.length; i++) {
        const copiedData = this.data.slice();
        copiedData.push(lolans.credits[i]);
        this.dataChange.next(copiedData);
      }
    });
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
