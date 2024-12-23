import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalWisePackageDataReportComponent } from './hospital-wise-package-data-report.component';

describe('HospitalWisePackageDataReportComponent', () => {
  let component: HospitalWisePackageDataReportComponent;
  let fixture: ComponentFixture<HospitalWisePackageDataReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalWisePackageDataReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalWisePackageDataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
