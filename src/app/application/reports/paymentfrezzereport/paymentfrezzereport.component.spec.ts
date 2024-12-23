import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfrezzereportComponent } from './paymentfrezzereport.component';

describe('PaymentfrezzereportComponent', () => {
  let component: PaymentfrezzereportComponent;
  let fixture: ComponentFixture<PaymentfrezzereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentfrezzereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfrezzereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
