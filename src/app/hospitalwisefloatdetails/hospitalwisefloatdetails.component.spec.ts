import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalwisefloatdetailsComponent } from './hospitalwisefloatdetails.component';

describe('HospitalwisefloatdetailsComponent', () => {
  let component: HospitalwisefloatdetailsComponent;
  let fixture: ComponentFixture<HospitalwisefloatdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalwisefloatdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalwisefloatdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
