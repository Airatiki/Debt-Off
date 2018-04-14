import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Purchase} from '../../../model/purchase';
import {errorMessage, digitRegex} from '../../../model/validators';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  form: FormGroup;
  private _purchase: Purchase;
  @Output() addPurchase = new EventEmitter<Purchase>();
  @Input() set purchase(value: Purchase) {
    const date = value.date
      ? new Date(value.date)
      : new Date();
    this.form.setValue({
      title: value.title,
      price: value.price,
      date: date.toISOString().substr(0, 10),
      comment: value.comment
    });

    this._purchase = this.form.value;
  }
  get purchase(): Purchase {
    return this._purchase;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  getErrors(errors: any): string {
    return errorMessage(errors);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['', [Validators.required, Validators.min(10), Validators.max(1000000), Validators.pattern(digitRegex)]],
      date: [''],
      comment: ['']
    });
  }

  onSubmit() {
    const price = parseFloat(this.form.value.price);

    if (!isFinite(price) || this.form.invalid) {
      return;
    }

    const date = this.form.value.date
      ? new Date(this.form.value.date)
      : new Date();

    const purchase: Purchase = {
      title: this.form.value.title,
      price: Math.floor(price * 100) / 100,
      date: date.toISOString()
    };

    if (this.form.value.comment) {
      purchase.comment = this.form.value.comment;
    }

    this.addPurchase.emit(purchase);
  }
}
