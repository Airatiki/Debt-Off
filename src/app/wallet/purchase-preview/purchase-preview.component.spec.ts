import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PurchasePreviewComponent} from './purchase-preview.component';
import {PageObject} from '../../../utils/pageObject';
import {DebugElement, SimpleChange} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddPurchaseModule} from '../add-purchase/add-purchase.module';
import {Purchase} from '../../model/purchase';
import {ReactiveFormsModule} from '@angular/forms';

describe('PurchasePreviewComponent | компонент превьюшки покупки', () => {
  class Page extends PageObject<PurchasePreviewComponent> {
    get header(): DebugElement {
      return this.getByAutomationId('header');
    }

    get price(): DebugElement {
      return this.getByAutomationId('price');
    }

    get previewBody(): DebugElement {
      return this.getByAutomationId('preview-body');
    }

    get date(): DebugElement {
      return this.getByAutomationId('date');
    }

    get comment(): DebugElement {
      return this.getByAutomationId('comment');
    }

    get editPurchaseForm(): DebugElement {
      return this.getByAutomationId('edit-purchase-form');
    }

    get beginEditBtn(): DebugElement {
      return this.getByAutomationId('begin-edit-btn');
    }

    get cancelEditBtn(): DebugElement {
      return this.getByAutomationId('cancel-edit-btn');
    }
  }

  let component: PurchasePreviewComponent;
  let fixture: ComponentFixture<PurchasePreviewComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AddPurchaseModule,
        ReactiveFormsModule
      ],
      declarations: [PurchasePreviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePreviewComponent);
    component = fixture.componentInstance;
    component.purchase = {
      title: 'foo',
      price: 100,
      date: '2017-10-3'
    };
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

  describe('инициализация', () => {
    it('выводит название покупки', () => {
      expect(page.text(page.header).indexOf('foo') > -1).toBe(true);
    });

    it('выводит стоимость покупки', () => {
      expect(page.text(page.price)).toBe('₽100.00');
    });

    it('блок с подробностями скрыт при isOpen === false', () => {
      component.isOpen = false;
      fixture.detectChanges();

      expect(page.previewBody === null).toBeTruthy();
    });

    it('блок с подробностями показан при isOpen === true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      expect(page.previewBody !== null).toBeTruthy();
    });

    it('клик на верхнюю часть создает внешнее событие клика', () => {
      let result = 0;
      component.previewClick.subscribe(() => {
        result++;
      });
      page.click(page.header);
      fixture.detectChanges();

      expect(result).toBe(1);
    });

    it('флаг isEdit установлен в false', () => {
      expect(component.isEdit).toBe(false);
    });

    it('форма для редактирования скрыта', () => {
      expect(page.editPurchaseForm === null).toBeTruthy();
    });

    it('кнопка начала редактирования скрыта', () => {
      expect(page.beginEditBtn === null).toBeTruthy();
    });

    it('кнопка начала редактирования показана при isOpen === true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      expect(page.beginEditBtn !== null).toBeTruthy();
    });

    it('кнопка отмены редактирования скрыта', () => {
      expect(page.cancelEditBtn === null).toBeTruthy();
    });
  });

  describe('подробности', () => {
    beforeEach(() => {
      component.isOpen = true;
      fixture.detectChanges();
    });

    it('выводит дату', () => {
      expect(page.text(page.date)).toBe('October 3, 2017');
    });

    it('выводит комментарий, если он передан', () => {
      component.purchase.comment = 'foo';
      fixture.detectChanges();

      expect(page.text(page.comment)).toBe('foo');
    });

    it('не отображает комментарий, если он не передан', () => {
      delete component.purchase.comment;
      fixture.detectChanges();

      expect(page.comment === null).toBeTruthy();
    });
  });

  describe('режим редактирования', () => {
    describe('клик на кнопку редактирования', () => {
      beforeEach(() => {
        component.isOpen = true;
        fixture.detectChanges();

        page.click(page.beginEditBtn);
      });

      it('устанавливает режим редактирования', () => {
        expect(component.isEdit).toBe(true);
      });

      it('показывает форму', () => {
        expect(page.editPurchaseForm !== null).toBeTruthy();
      });

      it('показывает кнопку отмены', () => {
        expect(page.cancelEditBtn !== null).toBeTruthy();
      });

      it('скрывает описание', () => {
        expect(page.previewBody === null).toBeTruthy();
      });

      it('скрывает заголовок', () => {
        expect(page.header === null).toBeTruthy();
      });
    });

    describe('клик на кнопку отмены', () => {
      beforeEach(() => {
        component.isOpen = true;
        fixture.detectChanges();

        page.click(page.beginEditBtn);
        page.click(page.cancelEditBtn);
      });

      it('снимает режим редактирования', () => {
        expect(component.isEdit).toBe(false);
      });

      it('скрывает форму', () => {
        expect(page.editPurchaseForm === null).toBeTruthy();
      });

      it('скрывает кнопку отмены', () => {
        expect(page.editPurchaseForm === null).toBeTruthy();
      });
    });

    it('снимается при внешнем изменении флага isOpen', () => {
      // подсказка — используйте ngOnChanges
      component.isOpen = true;
      fixture.detectChanges();
      component.isEdit = true;
      fixture.detectChanges();
      component.ngOnChanges({
        isOpen: new SimpleChange(true, false, false)
      });
      fixture.detectChanges();

      expect(component.isEdit).toBe(false);
    });
  });

  describe('onEditPurchase | редактирование формы', () => {
    let purchaseToAdd: Purchase;
    let resultPurchase: Purchase;

    beforeEach(() => {
      purchaseToAdd = {
        id: 'id не должно прокидываться',
        title: 'Чототам',
        price: 100,
        date: '2017-10-15',
        comment: 'Чототамская чототамь'
      };

      component.purchase.id = 'lalala';

      component.edit.subscribe((purchase) => {
        resultPurchase = purchase;
      });

      component.onEditPurchase(purchaseToAdd);
    });

    it('передает данные в Output, добавляет id по текущей покупке', () => {
      expect(resultPurchase).toEqual(Object.assign({}, purchaseToAdd, {id: 'lalala'}));
    });
  });
});
