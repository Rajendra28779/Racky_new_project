import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFreezeViewComponent } from './payment-freeze-view.component';

describe('PaymentFreezeViewComponent', () => {
  let component: PaymentFreezeViewComponent;
  let fixture: ComponentFixture<PaymentFreezeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentFreezeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFreezeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
