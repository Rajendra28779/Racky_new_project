import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CceReportTotalConnectedComponent } from './cce-report-total-connected.component';

describe('CceReportTotalConnectedComponent', () => {
  let component: CceReportTotalConnectedComponent;
  let fixture: ComponentFixture<CceReportTotalConnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CceReportTotalConnectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CceReportTotalConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
