import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfloatreportComponent } from './viewfloatreport.component';

describe('ViewfloatreportComponent', () => {
  let component: ViewfloatreportComponent;
  let fixture: ComponentFixture<ViewfloatreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewfloatreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfloatreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
