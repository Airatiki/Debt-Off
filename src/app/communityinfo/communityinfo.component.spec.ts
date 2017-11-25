import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityinfoComponent } from './communityinfo.component';

describe('CommunityinfoComponent', () => {
  let component: CommunityinfoComponent;
  let fixture: ComponentFixture<CommunityinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
