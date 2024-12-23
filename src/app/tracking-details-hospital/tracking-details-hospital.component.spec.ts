import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingDetailsHospitalComponent } from './tracking-details-hospital.component';

describe('TrackingDetailsHospitalComponent', () => {
  let component: TrackingDetailsHospitalComponent;
  let fixture: ComponentFixture<TrackingDetailsHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingDetailsHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingDetailsHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
