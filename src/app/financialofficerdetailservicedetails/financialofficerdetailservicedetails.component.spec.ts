import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialofficerdetailservicedetailsComponent } from './financialofficerdetailservicedetails.component';

describe('FinancialofficerdetailservicedetailsComponent', () => {
  let component: FinancialofficerdetailservicedetailsComponent;
  let fixture: ComponentFixture<FinancialofficerdetailservicedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialofficerdetailservicedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialofficerdetailservicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
