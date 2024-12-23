import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaFloatReportComponent } from './sna-float-report.component';

describe('SnaFloatReportComponent', () => {
  let component: SnaFloatReportComponent;
  let fixture: ComponentFixture<SnaFloatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaFloatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaFloatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
