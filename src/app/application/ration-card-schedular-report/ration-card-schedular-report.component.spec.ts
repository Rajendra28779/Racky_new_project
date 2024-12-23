import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RationCardSchedularReportComponent } from './ration-card-schedular-report.component';

describe('RationCardSchedularReportComponent', () => {
  let component: RationCardSchedularReportComponent;
  let fixture: ComponentFixture<RationCardSchedularReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RationCardSchedularReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RationCardSchedularReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
