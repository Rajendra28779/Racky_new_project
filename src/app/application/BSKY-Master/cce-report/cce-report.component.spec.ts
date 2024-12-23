import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CceReportComponent } from './cce-report.component';

describe('CceReportComponent', () => {
  let component: CceReportComponent;
  let fixture: ComponentFixture<CceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
