import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Purchase} from '../../../model/purchase';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {errorMessage, digitRegex} from '../../../model/validators';

@Component({
  selector: 'app-purchase-preview',
  templateUrl: './purchase-preview.component.html',
  styleUrls: ['./purchase-preview.component.css']
})
export class PurchasePreviewComponent implements OnInit, OnChanges {
  @Input() purchase: Purchase;
  @Input() isOpen: boolean;
  @Output() previewClick = new EventEmitter();
  @Output() previewDelete = new EventEmitter();
  @Output() edit = new EventEmitter<Purchase>();
  isEdit = false;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  getErrors(errors: any): string {
    return errorMessage(errors);
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      title: [this.purchase.title, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: [this.purchase.price, [Validators.required, Validators.min(10), Validators.max(1000000), Validators.pattern(digitRegex)]],
      date: [this.purchase.date],
      comment: [this.purchase.comment]
    });
  }

  ngOnChanges({isOpen}: SimpleChanges): void {
      this.isOpen = isOpen.currentValue;
      if (!this.isOpen) {
        this.isEdit = false;
      }
  }

  onClick() {
    this.previewClick.emit();
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();

    this.previewDelete.emit();
  }

  onEditPurchase(purch: Purchase) {
    if (this.purchase.id) {
      purch = Object.assign({...purch} , {id: this.purchase.id});
    }

    this.edit.emit(purch);
  }

  onCancelEdit() {
    this.isEdit = false;
    this.editForm.setValue({
      title: this.purchase.title,
      price: this.purchase.price,
      date: '',
      comment: this.purchase.comment ? this.purchase.comment : ''
    });
  }

  onEditClick() {
    this.isEdit = true;
  }

  onSubmit() {
    const price = parseFloat(this.editForm.value.price);

    if (!isFinite(price) || this.editForm.invalid) {
      return;
    }

    const date = this.editForm.value.date
      ? new Date(this.editForm.value.date)
      : new Date();

    const purchaseToEdit: Purchase = {
      title: this.editForm.value.title,
      price: Math.floor(price * 100) / 100,
      date: date.toISOString()
    };

    if (this.editForm.value.comment) {
      purchaseToEdit.comment = this.editForm.value.comment;
    }
    this.onEditPurchase(purchaseToEdit);
    this.isEdit = false;
  }
}
