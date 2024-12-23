import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentHistoryHospitalComponent } from './treatment-history-hospital.component';

describe('TreatmentHistoryHospitalComponent', () => {
  let component: TreatmentHistoryHospitalComponent;
  let fixture: ComponentFixture<TreatmentHistoryHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentHistoryHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentHistoryHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
