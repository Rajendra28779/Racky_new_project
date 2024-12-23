import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimProcessedComponent } from './ClaimProcessedComponent';

describe('PaymentfreezeComponent', () => {
  let component: ClaimProcessedComponent;
  let fixture: ComponentFixture<ClaimProcessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimProcessedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimProcessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
