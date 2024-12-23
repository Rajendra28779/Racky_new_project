import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalWiseClaimReportComponent } from './hospital-wise-claim-report.component';

describe('HospitalWiseClaimReportComponent', () => {
  let component: HospitalWiseClaimReportComponent;
  let fixture: ComponentFixture<HospitalWiseClaimReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalWiseClaimReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalWiseClaimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
