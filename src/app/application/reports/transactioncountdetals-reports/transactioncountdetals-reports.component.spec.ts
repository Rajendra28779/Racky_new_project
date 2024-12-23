import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactioncountdetalsReportsComponent } from './transactioncountdetals-reports.component';

describe('TransactioncountdetalsReportsComponent', () => {
  let component: TransactioncountdetalsReportsComponent;
  let fixture: ComponentFixture<TransactioncountdetalsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactioncountdetalsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactioncountdetalsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
