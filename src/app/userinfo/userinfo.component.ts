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
      'required': 'Обязательное поле',
      'minlength': 'Должно быть не менее 2 символов',
      'maxlength': 'Должно быть менее 25 символов'
    },
    'amount': {
      'required': 'Обязательное поле',
      'pattern': 'Поле должно содержать только цифры'
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
    console.log(this.paginator);
    // this.database = new ExampleDatabase(this.userservice, this.route);
    // this.dataSource = new ExampleDataSource(this.database, this.paginator);
    this.database = new ExampleDatabase(this.userservice, this.route);


    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserInfo(params['id']).subscribe(data => {
        this.user = data.json();
        this.isUser = true;
        console.log('USER PRISHEL', this.isUser);
        this.dataSource = new ExampleDataSource(this.database, this.paginator);

      });
      return params['id'];
    }).subscribe(() => {
    });

    this.createForm();
  }
  addDebt() {
    this.formCreated = true;
    this.showAddButton = false;
  }
  createForm() {
    this.debtForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      amount: ['', [Validators.required, Validators.pattern]],
      agree: false
    });

    this.debtForm.valueChanges.subscribe(data => this.onValueChanged(data));

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
    const invoice = this.debtForm.value.agree;
    console.log(this.debtForm.value.agree);
    this.debt = this.debtForm.value;
    this.submition = false;

    if (invoice) {
      this.userservice.createInvoice(this.user.info.id, this.debt.description, this.debt.amount)
        .subscribe(response => {
          console.log(response);
        });

    } else {
      this.userservice.createDebt(this.user.info.id, this.debt.description, this.debt.amount)
        .subscribe(response => {
            this.ngOnInit();
            console.log(response);
          },
          error => {
            console.log(error);
          });
    }

    this.cancelButton();
  }

  cancelButton() {
    this.formCreated = false;
    this.showAddButton = true;
    this.debtForm.reset();
  }
}

export class ExampleDatabase {
  totalAmount = 0;
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }
  user: any = {};
  constructor(private userservice: UserService, private route: ActivatedRoute) {

    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserHistory(params['id']).subscribe(data => {
        this.user = data;
        this.addDebts(data);
      });
      return params['id'];
    }).subscribe(() => {});
  }

  addDebts(userHistory) {
    this.totalAmount = userHistory.reduce(function (total, {color, amount}) {
      color === '#28a745' ? total += amount : total -= amount;
      return total;
    }, 0);

    userHistory.forEach(x => {
      // const date = new Date(x.time);
      // const hours = date.getHours() + ':' + date.getMinutes();
      // x.time = date.toDateString() + ' ' + hours;
      const copiedData = this.data.slice();
      copiedData.push(x);
      this.dataChange.next(copiedData);
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

