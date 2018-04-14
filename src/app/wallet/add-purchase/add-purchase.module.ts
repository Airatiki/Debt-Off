import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddPurchaseComponent} from './add-purchase.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [AddPurchaseComponent],
  exports: [AddPurchaseComponent]
})
export class AddPurchaseModule {
}
