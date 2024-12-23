import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargedetailsHistoryComponent } from './dischargedetails-history.component';

describe('DischargedetailsHistoryComponent', () => {
  let component: DischargedetailsHistoryComponent;
  let fixture: ComponentFixture<DischargedetailsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargedetailsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargedetailsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
