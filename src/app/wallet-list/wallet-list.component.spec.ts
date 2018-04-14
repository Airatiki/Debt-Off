import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WalletListComponent} from './wallet-list.component';
import {WalletListService} from './wallet-list.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable} from 'rxjs/Observable';

describe('WalletListComponent', () => {
  let component: WalletListComponent;
  let fixture: ComponentFixture<WalletListComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [WalletListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: WalletListService,
          useValue: {
            getWallets: () => Observable.of([])
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
