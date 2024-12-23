import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoispitalinfoReportComponent } from './hoispitalinfo-report.component';

describe('HoispitalinfoReportComponent', () => {
  let component: HoispitalinfoReportComponent;
  let fixture: ComponentFixture<HoispitalinfoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoispitalinfoReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoispitalinfoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
