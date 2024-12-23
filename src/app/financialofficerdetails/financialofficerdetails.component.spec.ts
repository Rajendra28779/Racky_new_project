import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialofficerdetailsComponent } from './financialofficerdetails.component';

describe('FinancialofficerdetailsComponent', () => {
  let component: FinancialofficerdetailsComponent;
  let fixture: ComponentFixture<FinancialofficerdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialofficerdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialofficerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
