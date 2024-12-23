import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPDActionReportComponent } from './cpdaction-report.component';

describe('CPDActionReportComponent', () => {
  let component: CPDActionReportComponent;
  let fixture: ComponentFixture<CPDActionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPDActionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CPDActionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
