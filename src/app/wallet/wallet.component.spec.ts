import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WalletComponent} from './wallet.component';
import {WalletModule} from './wallet.module';
import {PageObject} from '../../utils/pageObject';
import {DebugElement} from '@angular/core';
import {Purchase} from '../model/purchase';
import {WalletHttpService} from './wallet-http.service';
import createSpyObj = jasmine.createSpyObj;
import {Observable} from 'rxjs/Observable';
import {getPurchaseMock} from '../model/purchase.mock';

const walletMock = {
  id: 'foo',
  amount: 100000,
  name: 'Мой первый кошелек'
};

const purchasesMock: Purchase[] = [
  {
    id: '1',
    title: 'Проезд на метро',
    price: 1700,
    date: '2017-10-03'
  },
  {
    id: '2',
    title: 'IPhone X 256gb',
    price: 91990,
    date: '2017-10-03'
  },
  {
    id: '3',
    title: 'Лапша "Доширак"',
    price: 40,
    date: '2017-10-03'
  }
];

const purchasesMockTotal = purchasesMock.reduce((sum, {price}) => sum + price, 0);

describe('WalletComponent | компонент кошелька', () => {
  class Page extends PageObject<WalletComponent> {
    get title(): DebugElement {
      return this.getByAutomationId('title');
    }

    get subtitle(): DebugElement {
      return this.getByAutomationId('subtitle');
    }

    get togglePurchaseBtn(): DebugElement {
      return this.getByAutomationId('toggle-purchase-btn');
    }

    get newPurchaseForm(): DebugElement {
      return this.getByAutomationId('new-purchase-form');
    }

    get total(): DebugElement {
      return this.getByAutomationId('total');
    }

    getPurchasePreview(i: number): DebugElement {
      return this.getByAutomationId('purchase-preview-' + i);
    }
  }

  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let page: Page;
  let walletHttpServiceSpy: any;

  beforeEach(async(() => {
    walletHttpServiceSpy = createSpyObj('WalletHttpService', ['getPurchases', 'addPurchase', 'deletePurchase', 'updatePurchase']);
    TestBed.configureTestingModule({
      imports: [WalletModule],
      providers: [
        {
          provide: WalletHttpService,
          useValue: walletHttpServiceSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    component.wallet = Object.assign({}, walletMock);
    page = new Page(fixture);
    walletHttpServiceSpy.getPurchases.and.returnValue(Observable.of(purchasesMock));
    fixture.detectChanges();
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

  describe('при инициализации компонент', () => {
    it('содержит заголовок', () => {
      expect(page.title !== null).toBeTruthy();
      expect(page.text(page.title)).toBe(walletMock.name);
    });

    it('содержит подзаголовок', () => {
      expect(page.subtitle !== null).toBeTruthy();
      expect(page.text(page.subtitle)).toBe('Ваши расходы за последнюю неделю');
    });

    it('содержит кнопку "Добавить"', () => {
      expect(page.togglePurchaseBtn !== null).toBeTruthy();
      expect(page.text(page.togglePurchaseBtn)).toBe('Добавить');
    });

    it('блок добавления покупки скрыт', () => {
      expect(page.newPurchaseForm === null).toBeTruthy();
    });

    describe('клик на "Добавить"', () => {
      beforeEach(() => {
        page.click(page.togglePurchaseBtn);
        fixture.detectChanges();
      });

      it('изменяет текст кнопки на "Отменить"', () => {
        expect(page.text(page.togglePurchaseBtn)).toBe('Отменить');
      });

      it('показывает блок добавления покупки', () => {
        expect(page.newPurchaseForm !== null).toBeTruthy();
      });

      describe('второй клик на кнопку', () => {
        beforeEach(() => {
          page.click(page.togglePurchaseBtn);
          fixture.detectChanges();
        });

        it('изменяет текст кнопки на "Добавить"', () => {
          expect(page.text(page.togglePurchaseBtn)).toBe('Добавить');
        });

        it('скрывает блок добавления покупки', () => {
          expect(page.newPurchaseForm === null).toBeTruthy();
        });
      });
    });

    describe('загружает список покупок', () => {
      it('вызывает метод сервиса получения покупок', () => {
        expect(walletHttpServiceSpy.getPurchases).toHaveBeenCalled();
      });

      it('передает в метод сервиса id кошелька', () => {
        expect(walletHttpServiceSpy.getPurchases).toHaveBeenCalledWith('foo');
      });

      it('устанавливает покупки в обратном хронологическом порядке', () => {
        const reversed = purchasesMock.slice(0).reverse();

        expect(component.purchases).toEqual(reversed);
      });

      it('высчитывает общую сумму', () => {
        expect(component.total).toBe(purchasesMockTotal);
      });

      it('высчитывает баланс', () => {
        expect(component.balance).toBe(walletMock.amount - purchasesMockTotal);
      });
    });

    it('отображает баланс в поле Баланс', () => {
      component.total = 100;
      component.wallet.amount = 123;
      fixture.detectChanges();

      expect(page.text(page.total)).toBe(`Баланс: ₽23.00`);
    });
  });

  describe('отрисовывает список элементов', () => {
    it('не отрисовывает элементы, если их нет', () => {
      component.purchases = [];
      fixture.detectChanges();

      expect(page.getPurchasePreview(0) === null).toBeTruthy();
    });

    it('отрисовывает один элемент', () => {
      component.purchases = [purchasesMock[0]];
      fixture.detectChanges();

      expect(page.getPurchasePreview(0)).not.toBeNull('1-й элемент не отображен');
      expect(page.getPurchasePreview(1)).toBeNull('отображено более 1 элемента');
    });

    it('отрисовывает два элемента', () => {
      component.purchases = [purchasesMock[0], purchasesMock[1]];
      fixture.detectChanges();

      expect(page.getPurchasePreview(0)).not.toBeNull('1-й элемент не отображен');
      expect(page.getPurchasePreview(1)).not.toBeNull('2-й элемент не отображен');
      expect(page.getPurchasePreview(2)).toBeNull('отображено более 2 элементов');
    });
  });

  describe('onAddPurchase | добавление элемента', () => {
    beforeEach(() => {
      walletHttpServiceSpy.addPurchase.and.returnValue(Observable.of('4'));
      page.click(page.togglePurchaseBtn);
      fixture.detectChanges();
      component.onAddPurchase({
        id: 'должен быть перезаписан',
        title: 'foo',
        price: 100,
        date: '2017-10-03'
      });
      fixture.detectChanges();
    });

    it('вызывает метод добавления', () => {
      expect(walletHttpServiceSpy.addPurchase).toHaveBeenCalled();
    });

    it('передает в метод id кошелька', () => {
      const [id] = walletHttpServiceSpy.addPurchase.calls.mostRecent().args;

      expect(id).toBe(walletMock.id);
    });

    it('передает в метод покупку', () => {
      const [, purchase] = walletHttpServiceSpy.addPurchase.calls.mostRecent().args;

      expect(purchase).toEqual({
        id: 'должен быть перезаписан',
        title: 'foo',
        price: 100,
        date: '2017-10-03'
      });
    });

    it('добавляет элемент в начало списка', () => {
      expect(component.purchases[0]).toEqual({
        id: '4',
        title: 'foo',
        price: 100,
        date: '2017-10-03'
      });
    });

    it('пересчитывает общую сумму', () => {
      expect(component.total).toBe(purchasesMockTotal + 100);
    });

    it('скрывает форму добавления', () => {
      expect(page.newPurchaseForm === null).toBeTruthy();
    });
  });

  describe('onPreviewDelete', () => {
    let purchaseMock: Purchase;

    beforeEach(() => {
      purchaseMock = getPurchaseMock();
      purchaseMock.id = 'bar';
      walletHttpServiceSpy.getPurchases.calls.reset();
      walletHttpServiceSpy.deletePurchase.and.returnValue(Observable.of(null));
      component.onPreviewDelete(purchaseMock);
    });

    it('вызывает метод удаления', () => {
      expect(walletHttpServiceSpy.deletePurchase).toHaveBeenCalled();
    });

    it('передает в метод удаления id кошелька', () => {
      const [id] = walletHttpServiceSpy.deletePurchase.calls.mostRecent().args;

      expect(id).toBe(walletMock.id);
    });

    it('передает в метод удаления id покупки', () => {
      const [, id] = walletHttpServiceSpy.deletePurchase.calls.mostRecent().args;

      expect(id).toBe('bar');
    });

    it('вызывает метод загрузки всех покупок', () => {
      expect(walletHttpServiceSpy.getPurchases).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPurchaseEdit', () => {
    beforeEach(() => {
      walletHttpServiceSpy.updatePurchase.and.returnValue(Observable.of(null));
      walletHttpServiceSpy.getPurchases.calls.reset();
      component.onPurchaseEdit(getPurchaseMock());
    });

    it('вызывает метод обновления', () => {
      expect(walletHttpServiceSpy.updatePurchase).toHaveBeenCalled();
    });

    it('передает в метод обновления покупкy', () => {
      const [purchase] = walletHttpServiceSpy.updatePurchase.calls.mostRecent().args;

      expect(purchase).toEqual(getPurchaseMock());
    });

    it('вызывает метод загрузки всех покупок', () => {
      expect(walletHttpServiceSpy.getPurchases).toHaveBeenCalledTimes(1);
    });
  });
});
