import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdNamewsiseCountReportComponent } from './cpd-namewsise-count-report.component';

describe('CpdNamewsiseCountReportComponent', () => {
  let component: CpdNamewsiseCountReportComponent;
  let fixture: ComponentFixture<CpdNamewsiseCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdNamewsiseCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdNamewsiseCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
