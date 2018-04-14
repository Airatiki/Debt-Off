import {TestBed, inject} from '@angular/core/testing';

import {WalletListService} from './wallet-list.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BASE_URL} from '../constants/baseUrl.const';

describe('WalletListService', () => {
  let service: WalletListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletListService]
    });

    service = TestBed.get(WalletListService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getWallets | получает список кошельков', () => {
    let request: any;

    it('делает запрос GET /wallets.json', () => {
      service.getWallets().subscribe();

      request = httpMock.expectOne(`${BASE_URL}/wallets.json`);
      request.flush(null);

      expect(request.request.method).toBe('GET');
    });

    it('возвращает данные c id', () => {
      let result;
      service.getWallets().subscribe((data) => {
        result = data;
      });

      request = httpMock.expectOne(`${BASE_URL}/wallets.json`);
      request.flush({
        key1: {name: 'name1', amount: 100},
        key2: {name: 'name2', amount: 200}
      });

      expect(result).toEqual([{
        name: 'name1',
        amount: 100,
        id: 'key1'
      }, {
        name: 'name2',
        amount: 200,
        id: 'key2'
      }]);
    });
  });
});
