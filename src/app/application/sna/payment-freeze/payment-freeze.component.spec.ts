import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFreezeComponent } from './payment-freeze.component';

describe('PaymentFreezeComponent', () => {
  let component: PaymentFreezeComponent;
  let fixture: ComponentFixture<PaymentFreezeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentFreezeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
