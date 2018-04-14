import { Component, OnInit, ViewChild } from '@angular/core';
import {NavbarService} from '../services/navbar.service';
import {UserService} from '../services/user.service';
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material';
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

  dataLoaded = false;
  creditsDatabase: any;
  debtsDatabase: any;
  dataCredits: SummaryDataSource | null;
  dataDebts: SummaryDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('debtsPaginator') debtsPaginator: MatPaginator;

  constructor(public nav: NavbarService, private userservice: UserService, private router: Router, private route: ActivatedRoute ) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      window.location.href = 'http://localhost:4200';
      // window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.userservice.getUserSummary().subscribe( data => {
      this.dataLoaded = true;
      this.debtsDatabase = new DataBase(data.debts);
      this.dataDebts = new SummaryDataSource(this.debtsDatabase, this.debtsPaginator);

      this.creditsDatabase = new DataBase(data.credits);
      this.dataCredits = new SummaryDataSource(this.creditsDatabase, this.paginator);
    });
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


export class DataBase {
  /** Stream that emits whenever the data has been modified. */
  totalAmount = 0;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] {
    return this.dataChange.value;
  }

  constructor(private credits) {
    this.addData();
  }

  addData() {
    this.totalAmount = this.credits.reduce((total, {totalAmount}) => total += totalAmount, 0);
    this.credits.forEach(x => {
      const copiedData = this.data.slice();
      copiedData.push(x);
      this.dataChange.next(copiedData);
    });
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, DataBase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class SummaryDataSource extends DataSource<any> {
  constructor(private _creditsDatabase: DataBase, private _creditsPaginator: MatPaginator) {
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
