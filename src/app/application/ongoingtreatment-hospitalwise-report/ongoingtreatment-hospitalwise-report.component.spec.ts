import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingtreatmentHospitalwiseReportComponent } from './ongoingtreatment-hospitalwise-report.component';

describe('OngoingtreatmentHospitalwiseReportComponent', () => {
  let component: OngoingtreatmentHospitalwiseReportComponent;
  let fixture: ComponentFixture<OngoingtreatmentHospitalwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingtreatmentHospitalwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingtreatmentHospitalwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
