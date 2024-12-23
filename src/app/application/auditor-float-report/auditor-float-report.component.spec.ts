import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorFloatReportComponent } from './auditor-float-report.component';

describe('AuditorFloatReportComponent', () => {
  let component: AuditorFloatReportComponent;
  let fixture: ComponentFixture<AuditorFloatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorFloatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorFloatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
