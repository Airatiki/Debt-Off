import {TestBed} from '@angular/core/testing';

import {WalletHttpService} from './wallet-http.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {BASE_URL} from '../constants/baseUrl.const';
import {getPurchaseMock} from '../model/purchase.mock';
import {Purchase} from '../model/purchase';

describe('WalletHttpService ', () => {
  let service: WalletHttpService;
  let httpMock: HttpTestingController;
  let request: TestRequest;
  let result: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletHttpService]
    });

    service = TestBed.get(WalletHttpService);
    httpMock = TestBed.get(HttpTestingController);
    result = null;
    request = null;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getWalletPurchaseKeys | получает список связных с кошельком ключей покупок', () => {
    beforeEach(() => {
      service.getWalletPurchaseKeys('foo').subscribe((data) => {
        result = data;
      });

      request = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo.json`);
    });

    it('делает GET на purchasesPerWallets / id кошелька', () => {
      request.flush('');

      expect(request.request.method).toBe('GET');
    });

    it('возвращает список ключей', () => {
      request.flush({key1: true, key2: true});

      expect(result).toEqual(['key1', 'key2']);
    });

    it('возвращает пустой массив, если результат пуст', () => {
      request.flush('');

      expect(result).toEqual([]);
    });
  });

  describe('getPurchases | получает список связных с кошельком покупок', () => {
    beforeEach(() => {
      service.getPurchases('foo').subscribe((data) => {
        result = data;
      });

      request = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo.json`);
    });

    it('делает запрос на получение ключей кошельков', () => {
      request.flush('');

      expect(request.request.method).toBe('GET');
    });

    it('делает запрос на получение каждого из кошельков по ключу', () => {
      request.flush({key1: true, key2: true});

      const purchase1Request = httpMock.expectOne(`${BASE_URL}/purchases/key1.json`);
      const purchase2Request = httpMock.expectOne(`${BASE_URL}/purchases/key2.json`);

      purchase1Request.flush('');
      purchase2Request.flush('');

      expect(purchase1Request.request.method).toBe('GET');
      expect(purchase2Request.request.method).toBe('GET');
    });

    it('возвращает список кошельков', () => {
      request.flush({key1: true, key2: true});

      const purchase1Request = httpMock.expectOne(`${BASE_URL}/purchases/key1.json`);
      const purchase2Request = httpMock.expectOne(`${BASE_URL}/purchases/key2.json`);

      purchase1Request.flush(getPurchaseMock());
      purchase2Request.flush(getPurchaseMock());

      expect(result).toEqual([
        Object.assign(getPurchaseMock(), {id: 'key1'}),
        Object.assign(getPurchaseMock(), {id: 'key2'})
      ]);
    });

    it('фильтрует пустые значения', () => {
      request.flush({key1: true, key2: true});

      const purchase1Request = httpMock.expectOne(`${BASE_URL}/purchases/key1.json`);
      const purchase2Request = httpMock.expectOne(`${BASE_URL}/purchases/key2.json`);

      purchase1Request.flush(getPurchaseMock());
      purchase2Request.flush('');

      expect(result).toEqual([
        Object.assign(getPurchaseMock(), {id: 'key1'})
      ]);
    });
  });

  describe('getPurchase | получает покупку по id', () => {
    beforeEach(() => {
      service.getPurchase('foo').subscribe((data) => {
        result = data;
      });

      request = httpMock.expectOne(`${BASE_URL}/purchases/foo.json`);
    });

    it('делает GET на purchases / id покупки', () => {
      request.flush('');

      expect(request.request.method).toBe('GET');
    });

    it('добавляет к ответу ключ в поле id', () => {
      const purchase = getPurchaseMock();

      request.flush(purchase);

      expect(result).toEqual(Object.assign(getPurchaseMock(), {id: 'foo'}));
    });

    it('пустое значение возвращается без добавления id', () => {
      request.flush('');

      expect(result).toBeNull();
    });
  });

  describe('addPurchase | добавляет покупку', () => {
    let patchRequest: any;

    beforeEach(() => {
      service.addPurchase('foo', getPurchaseMock()).subscribe((data) => {
        result = data;
      });

      request = httpMock.expectOne(`${BASE_URL}/purchases.json`);
    });

    it('делает POST запрос на purchases', () => {
      request.flush({name: 'bar'});
      patchRequest = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo.json`);
      patchRequest.flush({bar: true});

      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(getPurchaseMock());
    });

    it('делает PATCH запрос с полученным id покупки на purchasesPerWallets / id кошелька', () => {
      request.flush({name: 'bar'});
      patchRequest = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo.json`);
      patchRequest.flush({bar: true});

      expect(patchRequest.request.method).toBe('PATCH');
      expect(patchRequest.request.body).toEqual({bar: true});
    });

    it('возвращает id покупки', () => {
      request.flush({name: 'bar'});
      patchRequest = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo.json`);
      patchRequest.flush({bar: true});

      expect(result).toBe('bar');
    });
  });

  describe('deletePurchase | удаляет покупку', () => {
    beforeEach(() => {
      service.deletePurchase('foo', 'bar').subscribe();
    });

    it('делает DELETE на удаление покупки на purchases / id покупки', () => {
      request = httpMock.expectOne(`${BASE_URL}/purchases/bar.json`);
      httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo/bar.json`).flush('');
      request.flush('');

      expect(request.request.method).toBe('DELETE');
    });

    it('делает DELETE на удаление покупки на purchasesPerWallets / id кошелька / id покупки', () => {
      httpMock.expectOne(`${BASE_URL}/purchases/bar.json`).flush('');
      request = httpMock.expectOne(`${BASE_URL}/purchasesPerWallets/foo/bar.json`);
      request.flush('');

      expect(request.request.method).toBe('DELETE');
    });
  });

  describe('updatePurchase | обновляет покупку', () => {
    let purchaseMock: Purchase;
    beforeEach(() => {
      purchaseMock = getPurchaseMock();
      purchaseMock.id = 'bar';
    });

    it('делает PUT запрос на purchases / id покупки', () => {
      service.updatePurchase(purchaseMock).subscribe();

      request = httpMock.expectOne(`${BASE_URL}/purchases/bar.json`);
      request.flush('');

      expect(request.request.method).toBe('PUT');
    });

    it('передает в теле запроса покупку без id', () => {
      const expected = getPurchaseMock();

      delete expected.id;

      service.updatePurchase(purchaseMock).subscribe();

      request = httpMock.expectOne(`${BASE_URL}/purchases/bar.json`);
      request.flush('');

      expect(request.request.body).toEqual(expected);
    });

    describe('если в покупке нет id', () => {
      beforeEach(() => {
        result = undefined;
        delete purchaseMock.id;

        service.updatePurchase(purchaseMock).subscribe((data) => {
          result = data;
        });
      });

      it('возвращает Observable.of(null)', () => {
        expect(result).toBeNull();
      });

      it('запрос не делается', () => {
        httpMock.expectNone(`${BASE_URL}/purchases/bar.json`);
      });
    });
  });
});
