import {Component, Input, OnInit} from '@angular/core';
import {Purchase} from '../../model/purchase';
import {WalletService} from './wallet.service';
import {Wallet} from '../../model/wallet';
import {WalletHttpService} from './wallet-http.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [WalletService]
})
export class WalletComponent implements OnInit {
  @Input() wallet: Wallet;

  purchases: Purchase[] = [];
  total = 0;
  isAddPurchaseOpen = false;

  private currentOpen: number;

  constructor(private walletService: WalletService,
              private walletHttpService: WalletHttpService) {
  }

  get balance(): number {
    return this.wallet.amount - this.total;
  }

  ngOnInit() {
    this.loadPurchases();
  }

  onAddPurchase(newPurchase: Purchase) {
    this.walletHttpService.addPurchase(this.wallet.id, newPurchase)
      .subscribe((id) => {
        const resultPurchase = Object.assign({}, newPurchase, {id});

        this.setPurchasesAsync([...this.purchases, resultPurchase]);
        this.toggleAdd();
      });
  }

  toggleAdd() {
    this.isAddPurchaseOpen = !this.isAddPurchaseOpen;
  }

  onPreviewClick(index: number) {
    if (index === this.currentOpen) {
      this.currentOpen = null;
      return;
    }

    this.currentOpen = index;
  }

  onPreviewDelete({id}: Purchase) {
    this.walletHttpService.deletePurchase(this.wallet.id, id)
      .subscribe(() => {
      console.log('DELETED');
        this.loadPurchases();
      });
  }

  onPurchaseEdit(purchase: Purchase) {
    this.walletHttpService.updatePurchase(purchase).subscribe(() => this.loadPurchases());
  }

  isCurrentOpen(index: number): boolean {
    return this.currentOpen === index;
  }

  private loadPurchases() {
    this.walletHttpService.getPurchases(this.wallet.id)
      .subscribe((purchases) => {
        this.setPurchasesAsync(purchases);
      });
  }

  private setPurchasesAsync(purchases: Purchase[]) {
    this.purchases = purchases.slice(0).reverse();
    this.total = this.walletService.getTotal(this.purchases);
  }
}
