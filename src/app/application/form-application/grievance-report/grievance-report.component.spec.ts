import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceReportComponent } from './grievance-report.component';

describe('GrievanceReportComponent', () => {
  let component: GrievanceReportComponent;
  let fixture: ComponentFixture<GrievanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
