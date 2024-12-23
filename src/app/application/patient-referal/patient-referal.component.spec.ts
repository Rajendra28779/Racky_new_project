import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReferalComponent } from './patient-referal.component';

describe('PatientReferalComponent', () => {
  let component: PatientReferalComponent;
  let fixture: ComponentFixture<PatientReferalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientReferalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
