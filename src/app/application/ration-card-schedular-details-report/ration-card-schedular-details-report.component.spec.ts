import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RationCardSchedularDetailsReportComponent } from './ration-card-schedular-details-report.component';

describe('RationCardSchedularDetailsReportComponent', () => {
  let component: RationCardSchedularDetailsReportComponent;
  let fixture: ComponentFixture<RationCardSchedularDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RationCardSchedularDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RationCardSchedularDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
