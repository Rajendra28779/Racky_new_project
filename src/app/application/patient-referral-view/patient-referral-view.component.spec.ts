import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReferralViewComponent } from './patient-referral-view.component';

describe('PatientReferralViewComponent', () => {
  let component: PatientReferralViewComponent;
  let fixture: ComponentFixture<PatientReferralViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientReferralViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientReferralViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
