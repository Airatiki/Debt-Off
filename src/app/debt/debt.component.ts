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
import {ActivatedRoute, Router} from '@angular/router';


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
  totalDebtsAmount: number;
  totalCreditsAmount: number;

  constructor(public nav: NavbarService, private userservice: UserService, private router: Router, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.debtsDatabase = new ExampleDatabase(this.userservice, false);
    this.dataDebts = new ExampleDataSource(this.debtsDatabase, this.debtsPaginator);


    this.creditsDatabase = new ExampleDatabase(this.userservice, true);
    this.dataCredits = new ExampleDataSource(this.creditsDatabase, this.paginator);
    this.totalCreditsAmount  = 151;
    this.totalDebtsAmount = 1404;
    console.log(loans);

  }

  onUserClick(user) {
    // console.log(user);
    this.router.navigate(['/home/userinfo/' + user.id], { relativeTo: this.route });
  }

}

let loans: any = {};
let totalDebtsAmountans: any = {};


export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  totalDebts = 0;
  totalCredits = 0;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(private userservice: UserService, private isCredit: boolean) {
    console.log('EXAMPLE START, LOANS ');
    // console.log(loans);
    this.isCredit ? this.addCredits() : this.addDebts();
  }

  addDebts() {
    this.userservice.getUserSummary().subscribe(data => {
      totalDebtsAmountans = data.json();
      this.totalDebts = totalDebtsAmountans.debts.reduce((total, {totalAmount}) => total += totalAmount, 0);;
      for (let i = 0; i < totalDebtsAmountans.debts.length; i++) {
        const date = new Date(totalDebtsAmountans.debts[i].time);
        const hours = date.getHours() + ':' + date.getMinutes();
        totalDebtsAmountans.debts[i].time = date.toDateString() + ' ' + hours;
        const copiedData = this.data.slice();
        copiedData.push(totalDebtsAmountans.debts[i]);
        this.dataChange.next(copiedData);
      }
    });

  }
  /** Adds a new user to the database. */
  // TODO: Add error checking
  addCredits() {
    this.userservice.getUserSummary().subscribe(data => {
      totalDebtsAmountans = data.json();
      this.totalCredits = totalDebtsAmountans.credits.reduce((total, {totalAmount}) => total += totalAmount, 0);
      console.log(totalDebtsAmountans.credits.totalAmount);
      for (let i = 0; i < totalDebtsAmountans.credits.length; i++) {
        const date = new Date(totalDebtsAmountans.credits[i].time);
        const hours = date.getHours() + ':' + date.getMinutes();
        totalDebtsAmountans.credits[i].time = date.toDateString() + ' ' + hours;
        const copiedData = this.data.slice();
        copiedData.push(totalDebtsAmountans.credits[i]);
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
