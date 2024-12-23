import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidreportComponent } from './paidreport.component';

describe('PaidreportComponent', () => {
  let component: PaidreportComponent;
  let fixture: ComponentFixture<PaidreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
