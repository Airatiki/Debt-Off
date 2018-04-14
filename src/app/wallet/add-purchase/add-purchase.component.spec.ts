import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPurchaseComponent} from './add-purchase.component';
import {AddPurchaseModule} from './add-purchase.module';
import {PageObject} from '../../../utils/pageObject';
import {DebugElement} from '@angular/core';
import {Purchase} from '../../model/purchase';
import {AbstractControl} from '@angular/forms';
import {getPurchaseMock} from '../../model/purchase.mock';

describe('AddPurchaseComponent | форма добавления покупки', () => {
  class Page extends PageObject<AddPurchaseComponent> {
    get titleControl(): DebugElement {
      return this.getByAutomationId('title-control');
    }

    get titleError(): DebugElement {
      return this.getByAutomationId('title-error');
    }

    get priceError(): DebugElement {
      return this.getByAutomationId('price-error');
    }

    get priceControl(): DebugElement {
      return this.getByAutomationId('price-control');
    }

    get dateControl(): DebugElement {
      return this.getByAutomationId('date-control');
    }

    get commentControl(): DebugElement {
      return this.getByAutomationId('comment-control');
    }

    get submit(): DebugElement {
      return this.getByAutomationId('submit');
    }

    verifyErrorElement(element: DebugElement): boolean {
      return element.attributes['class'] === 'invalid-feedback';
    }
  }

  let component: AddPurchaseComponent;
  let fixture: ComponentFixture<AddPurchaseComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AddPurchaseModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

  describe('инициализация', () => {
    describe('если не передан purchase', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('пустой title', () => {
        expect(component.form.value.title).toBe('');
        expect(page.inputText(page.titleControl)).toBe('');
      });
      it('пустой price', () => {
        expect(component.form.value.price).toBe('');
        expect(page.inputText(page.priceControl)).toBe('');
      });
      it('пустой date', () => {
        expect(component.form.value.date).toBe('');
        expect(page.inputText(page.titleControl)).toBe('');
      });
      it('пустой comment', () => {
        expect(component.form.value.comment).toBe('');
        expect(page.inputText(page.titleControl)).toBe('');
      });
    });

    describe('если передан purchase', () => {
      let purchaseMock: Purchase;

      beforeEach(() => {
        purchaseMock = getPurchaseMock();
      });

      it('заполняет title значением из purchase', () => {
        purchaseMock.title = 'foo';
        fixture.detectChanges();
        component.purchase = purchaseMock;
        fixture.detectChanges();

        expect(component.form.value.title).toBe('foo');
        expect(page.inputText(page.titleControl)).toBe('foo');
      });

      it('заполняет price значением из purchase', () => {
        purchaseMock.price = 100;
        fixture.detectChanges();
        component.purchase = purchaseMock;
        fixture.detectChanges();

        expect(component.form.value.price).toBe(100);
        expect(page.inputText(page.priceControl)).toBe('100');
      });

      it('заполняет date значением из purchase', () => {
        purchaseMock.date = '2017-11-17T18:19:20.345Z';
        fixture.detectChanges();
        component.purchase = purchaseMock;
        fixture.detectChanges();

        expect(component.form.value.date).toBe('2017-11-17');
        expect(page.inputText(page.dateControl)).toBe('2017-11-17');
      });

      it('заполняет comment значением из purchase', () => {
        purchaseMock.comment = 'foo';
        fixture.detectChanges();
        component.purchase = purchaseMock;
        fixture.detectChanges();

        expect(component.form.value.comment).toBe('foo');
        expect(page.inputText(page.commentControl)).toBe('foo');
      });
    });

    describe('ошибки', () => {
      it('существует блок ошибки для title', () => {
        expect(page.titleError !== null).toBeTruthy();
        expect(page.verifyErrorElement(page.titleError)).toBe(true);
      });

      it('существует блок ошибки для price', () => {
        expect(page.priceError !== null).toBeTruthy();
        expect(page.verifyErrorElement(page.priceError)).toBe(true);
      });
    });
  });

  describe('заполнение формы', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('поле title', () => {
      let field: AbstractControl;

      beforeEach(() => {
        field = component.form.get('title');
      });

      describe('пустое поле', () => {
        beforeEach(() => {
          field.setValue('');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку required', () => {
          expect(field.errors['required']).toBeTruthy();
        });

        it('в тексте ошибки выводится "поле обязательно для заполнения"', () => {
          fixture.detectChanges();
          expect(page.text(page.titleError)).toBe('поле обязательно для заполнения');
        });
      });

      describe('поле «fo»', () => {
        beforeEach(() => {
          field.setValue('fo');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку minlength', () => {
          expect(field.errors['minlength']).toBeTruthy();
        });

        it('в тексте ошибки выводится "минимальная длина — 3"', () => {
          fixture.detectChanges();
          expect(page.text(page.titleError)).toBe('минимальная длина — 3');
        });
      });

      describe('поле из 81 символа', () => {
        beforeEach(() => {
          field.setValue(new Array(82).join('1'));
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку maxlength', () => {
          expect(field.errors['maxlength']).toBeTruthy();
        });

        it('в тексте ошибки выводится "максимальная длина — 80"', () => {
          fixture.detectChanges();
          expect(page.text(page.titleError)).toBe('максимальная длина — 80');
        });
      });

      it('поле «foo» валидно', () => {
        field.setValue('foo');
        expect(field.valid).toBe(true);
      });

      it('поле из 80 символов валидно', () => {
        field.setValue(new Array(81).join('1'));
        expect(field.valid).toBe(true);
      });
    });

    describe('price', () => {
      let field: AbstractControl;

      beforeEach(() => {
        field = component.form.get('price');
      });

      describe('пустое поле', () => {
        beforeEach(() => {
          field.setValue('');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку required', () => {
          expect(field.errors['required']).toBeTruthy();
        });

        it('в тексте ошибки выводится "поле обязательно для заполнения"', () => {
          fixture.detectChanges();
          expect(page.text(page.priceError)).toBe('поле обязательно для заполнения');
        });
      });

      describe('поле "foo"', () => {
        beforeEach(() => {
          field.setValue('foo');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку pattern', () => {
          expect(field.errors['pattern']).toBeTruthy();
        });

        it('в тексте ошибки выводится "разрешены лишь цифры"', () => {
          fixture.detectChanges();
          expect(page.text(page.priceError)).toBe('разрешены лишь цифры');
        });
      });

      describe('поле "9"', () => {
        beforeEach(() => {
          field.setValue('9');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку min', () => {
          expect(field.errors['min']).toBeTruthy();
        });

        it('в тексте ошибки выводится "минимальное значение "', () => {
          fixture.detectChanges();
          expect(page.text(page.priceError)).toBe('минимальное значение 10');
        });
      });

      describe('поле "1000001"', () => {
        beforeEach(() => {
          field.setValue('1000001');
        });

        it('невалидно', () => {
          expect(field.valid).toBe(false);
        });

        it('содержит ошибку max', () => {
          expect(field.errors['max']).toBeTruthy();
        });

        it('в тексте ошибки выводится "максимальное значение "', () => {
          fixture.detectChanges();
          expect(page.text(page.priceError)).toBe('максимальное значение 1000000');
        });
      });

      it('поле "123.123" валидно', () => {
        field.setValue('123.123');
        expect(field.valid).toBe(true);
      });

      it('поле "10" валидно', () => {
        field.setValue('10');
        expect(field.valid).toBe(true);
      });

      it('поле "1000000" валидно', () => {
        field.setValue('1000000');
        expect(field.valid).toBe(true);
      });
    });

    describe('кнопка отправки', () => {
      beforeEach(() => {
        component.form.patchValue({
          title: 'foo',
          price: '123'
        });
        component.form.markAsDirty();
        fixture.detectChanges();
      });

      it('не заблокирована, если все поля валидны и форма изменена', () => {
        expect(page.submit.nativeElement.disabled).toBe(false);
      });

      describe('заблокирована, если', () => {
        it('поле title невалидно', () => {
          component.form.patchValue({title: ''});
          fixture.detectChanges();

          expect(component.form.get('title').valid).toBe(false);
          expect(page.submit.nativeElement.disabled).toBe(true);
        });

        it('поле price невалидно', () => {
          component.form.patchValue({price: ''});
          fixture.detectChanges();

          expect(component.form.get('price').valid).toBe(false);
          expect(page.submit.nativeElement.disabled).toBe(true);
        });

        it('форма не изменена', () => {
          component.form.markAsPristine();
          fixture.detectChanges();

          expect(component.form.pristine).toBe(true, 'pristine');
          expect(page.submit.nativeElement.disabled).toBe(true, 'disabled');
        });
      });
    });

    describe('отправка формы', () => {
      beforeEach(() => {
        component.form.patchValue({
          title: 'foo',
          price: '123'
        });
        component.form.markAsDirty();
        fixture.detectChanges();
      });

      describe('событие добавления', () => {
        let result: number;

        beforeEach(() => {
          result = 0;
          component.addPurchase
            .subscribe(() => {
              result++;
            });
        });

        it('создает событие добавления, если price число', () => {
          component.onSubmit();

          expect(result).toBe(1);
        });

        it('не создает событие добавления, если в поле price «foo»', () => {
          component.form.patchValue({price: 'foo'});
          component.onSubmit();

          expect(result).toBe(0);
        });

        it('не создает событие добавления, если в поле price Infinity', () => {
          component.form.patchValue({price: Infinity});
          component.onSubmit();

          expect(result).toBe(0);
        });

        it('не создает событие добавления, если форма не валидна', () => {
          component.form.patchValue({title: ''});
          component.onSubmit();

          expect(result).toBe(0);
        });
      });

      describe('в событии добавления передается', () => {
        let result: Purchase;

        beforeEach(() => {
          component.addPurchase
            .subscribe(purchase => {
              result = purchase;
            });
        });

        it('корректный title', () => {
          component.form.patchValue({title: 'bar'});
          component.onSubmit();

          expect(result.title).toBe('bar');
        });

        it('округленный price', () => {
          component.form.patchValue({price: '123.456'});
          component.onSubmit();

          expect(result.price).toBe(123.45);
        });

        describe('дата', () => {
          it('передается 2017-10-15', () => {
            component.form.patchValue({date: '2017-10-15'});
            component.onSubmit();

            expect(new Date(result.date).valueOf()).toBe(new Date('2017-10-15').valueOf());
          });

          it('если не задана, передается время "сейчас" в формате ISO', () => {
            component.form.patchValue({date: ''});
            component.onSubmit();

            expect(new Date(result.date).getTime() - Date.now() < 1000).toBe(true);
          });
        });
      });
    });
  });
});
