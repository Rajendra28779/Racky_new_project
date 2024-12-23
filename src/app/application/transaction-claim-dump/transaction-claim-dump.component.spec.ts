import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionClaimDumpComponent } from './transaction-claim-dump.component';

describe('TransactionClaimDumpComponent', () => {
  let component: TransactionClaimDumpComponent;
  let fixture: ComponentFixture<TransactionClaimDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionClaimDumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionClaimDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
