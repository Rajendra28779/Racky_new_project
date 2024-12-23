import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFreezeActionComponent } from './payment-freeze-action.component';

describe('PaymentFreezeActionComponent', () => {
  let component: PaymentFreezeActionComponent;
  let fixture: ComponentFixture<PaymentFreezeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentFreezeActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFreezeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
