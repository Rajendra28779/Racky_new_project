import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTreatmentReportComponent } from './ongoing-treatment-report.component';

describe('OngoingTreatmentReportComponent', () => {
  let component: OngoingTreatmentReportComponent;
  let fixture: ComponentFixture<OngoingTreatmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingTreatmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTreatmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
