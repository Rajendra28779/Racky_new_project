import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatReportComponent } from './float-report.component';

describe('FloatReportComponent', () => {
  let component: FloatReportComponent;
  let fixture: ComponentFixture<FloatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
