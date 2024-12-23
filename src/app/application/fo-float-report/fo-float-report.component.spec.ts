import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFloatReportComponent } from './fo-float-report.component';

describe('FoFloatReportComponent', () => {
  let component: FoFloatReportComponent;
  let fixture: ComponentFixture<FoFloatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoFloatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFloatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
