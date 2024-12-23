import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfreezListComponent } from './paymentfreez-list.component';

describe('PaymentfreezListComponent', () => {
  let component: PaymentfreezListComponent;
  let fixture: ComponentFixture<PaymentfreezListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentfreezListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfreezListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
