import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import 'rxjs/add/operator/switchMap';
import {MatPaginator} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Debt} from '../shared/Debt';
import {User} from '../shared/User';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  formErrors = {
    'description': '',
    'amount': '',
  };

  formReturnErrors = {
    'amount': ''
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

  validationReturnMessages = {
    'amount': {
      'required': 'Обязательное поле',
      'pattern': 'Поле должно содержать только цифры'
    }
  };

  showAddButton = true;
  showReturnButton = true;
  formCreated = false;
  formReturnCreated = false;
  debtForm: FormGroup;
  debtReturnForm: FormGroup;
  debt: Debt;

  displayedColumns = ['Description', 'Date', 'Amount'];
  database: any;
  dataSource: SummaryDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private userservice: UserService, private fb: FormBuilder) { }
  user: User;
  isUser = false;
  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      // window.location.href = 'http://localhost:4200';
      window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.database = new SummaryDataBase(this.userservice, this.route);

    this.route.params.switchMap((params: Params) => {
      this.userservice.getUserInfo(params['id']).subscribe(user => {
        this.user = user;
        this.isUser = true;
        this.dataSource = new SummaryDataSource(this.database, this.paginator);
      });
      return params['id'];
    }).subscribe(() => {
    });

    this.createForm();
    this.createReturnForm();
  }
  addDebt() {
    this.formCreated = true;
    this.showAddButton = false;
    this.showReturnButton = false;
  }

  returnDebt() {
    this.formReturnCreated = true;
    this.showReturnButton = false;
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

  createReturnForm() {
    this.debtReturnForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern]]
    });
    this.debtReturnForm.valueChanges.subscribe(data => this.onValueReturnChanged(data));
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

  onValueReturnChanged(data?: any) {
    if (!this.debtReturnForm) { return; }
    const form = this.debtReturnForm;

    for (const field in this.formReturnErrors) {
      this.formReturnErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationReturnMessages[field];
        for (const key in control.errors) {
          this.formReturnErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    const invoice = this.debtForm.value.agree;
    this.debt = this.debtForm.value;

    if (invoice) {
      this.userservice.createInvoice(this.user.id, this.debt.description, this.debt.amount)
        .subscribe(response => {
          console.log(response);
        });

    } else {
      this.userservice.createDebt(this.user.id, this.debt.description, this.debt.amount)
        .subscribe(() => {
            this.ngOnInit();
          },
          error => {
            console.log(error);
          });
    }
    this.cancelButton();
  }

  onReturnSubmit() {
    this.userservice.createInvoice(this.user.id, 'Возврат долга', this.debtReturnForm.value.amount)
      .subscribe(res => console.log(res));
    this.cancelReturnButton();
  }

  cancelButton() {
    this.formCreated = false;
    this.showAddButton = true;
    this.showReturnButton = true;
    this.debtForm.reset();
  }

  cancelReturnButton() {
    this.formReturnCreated = false;
    this.showReturnButton = true;
    this.showAddButton = true;
    this.debtReturnForm.reset();
  }

  vkNavigate(event, id: number) {
    event.stopPropagation();
    window.open(
      `https://vk.com/${id}`,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
}

export class SummaryDataBase {
  header = {
    plus: 'Вам должны: ',
    minus: 'Вы должны: '
  };
  headerText = '';
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

    if (this.totalAmount > 0) {
      this.headerText = this.header.plus;
    } else {
      this.totalAmount *= -1;
      this.headerText = this.header.minus;
    }

    userHistory.forEach(x => {
      const copiedData = this.data.slice();
      copiedData.push(x);
      this.dataChange.next(copiedData);
    });
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, SummaryDataBase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class SummaryDataSource extends DataSource<any> {
  constructor(private _creditsDatabase: SummaryDataBase, private _creditsPaginator: MatPaginator) {
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

