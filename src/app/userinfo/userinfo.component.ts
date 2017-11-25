import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import 'rxjs/add/operator/switchMap';
import {MdPaginator} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Debt} from '../shared/Debt';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  submition = true;
  showAddButton = true;
  formCreated = false;
  debtForm: FormGroup;
  debt: Debt;
  formErrors = {
    'description': '',
    'amount': '',
  };

  validationMessages = {
    'description': {
      'required': 'Description is required.',
      'minlength': 'Description must be at least 2 ch long',
      'maxlength': 'Description must be less than 25 ch long'
    },
    'amount': {
      'required': 'amount is required.',
      'pattern': 'amount must be contain only numbers'
    }
  };
  displayedColumns = ['Description', 'Date', 'Amount'];
  database: any;
  dataSource: ExampleDataSource | null;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(private route: ActivatedRoute, private userservice: UserService, private fb: FormBuilder) { }
  user: any = {};
  isUser = false;
  ngOnInit() {
    this.database = new ExampleDatabase(this.userservice, this.route);
    this.dataSource = new ExampleDataSource(this.database, this.paginator);

    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserInfo(params['id']).subscribe(data => {
        this.user = data.json();
        this.isUser = true;
        console.log('HUILOOO', this.user);
      });
      console.log(params['id'], 'petuh');
      return params['id'];
    }).subscribe(_ => {});
    console.log(this.user);
  }
  addDebt() {
    this.createForm();
    this.showAddButton = false;
    console.log('kek');
  }
  createForm() {
    this.formCreated = true;
    this.debtForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      amount: ['', [Validators.required, Validators.pattern]]
    });

    this.debtForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.debtForm) { return; }
    const form = this.debtForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.debt = this.debtForm.value;
    this.submition = false;
    this.userservice.createDebt(this.user.info.id, this.debt.description, this.debt.amount)
      .subscribe(response => {
        console.log(response);
      },
        error => {
        console.log(error);
        });

    this.debtForm.reset({
      description: '',
      amount: ''
    });
  }

  cancelButton() {
    this.formCreated = false;
    this.showAddButton = true;

  }
}

let lolans: any = {};
export class ExampleDatabase {
  totalAmount = 0;
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
  }

  addDebts(user) {


    // console.log(user.credits.map(user.debts));

    console.log('SUCHARA--------', user);
    for (let i = 0; i < user.credits.length; i++){
      this.totalAmount += user.credits[i].amount;
      const date = new Date(user.credits[i].time);
      const hours = date.getHours() + ':' + date.getMinutes();
      user.credits[i].time = date.toDateString() + ' ' + hours;
      const copiedData = this.data.slice();
      copiedData.push(this.createNewUser(user.credits[i], 'green'));
      this.dataChange.next(copiedData);
    }
    for ( let i = 0; i < user.debts.length; i++) {
      this.totalAmount -= user.debts[i].amount;
      const date = new Date(user.debts[i].time);
      const hours = date.getHours() + ':' + date.getMinutes();
      user.debts[i].time = date.toDateString() + ' ' + hours;
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

