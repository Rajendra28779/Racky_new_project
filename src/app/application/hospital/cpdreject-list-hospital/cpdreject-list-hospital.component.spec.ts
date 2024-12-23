import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPDRejectListHospitalComponent } from './cpdreject-list-hospital.component';

describe('CPDRejectListHospitalComponent', () => {
  let component: CPDRejectListHospitalComponent;
  let fixture: ComponentFixture<CPDRejectListHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPDRejectListHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CPDRejectListHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
