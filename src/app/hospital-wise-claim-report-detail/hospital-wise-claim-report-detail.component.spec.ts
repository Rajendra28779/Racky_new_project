import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalWiseClaimReportDetailComponent } from './hospital-wise-claim-report-detail.component';

describe('HospitalWiseClaimReportDetailComponent', () => {
  let component: HospitalWiseClaimReportDetailComponent;
  let fixture: ComponentFixture<HospitalWiseClaimReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalWiseClaimReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalWiseClaimReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
