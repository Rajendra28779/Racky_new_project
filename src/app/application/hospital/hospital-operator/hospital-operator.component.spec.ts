import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalOperatorComponent } from './hospital-operator.component';

describe('HospitalOperatorComponent', () => {
  let component: HospitalOperatorComponent;
  let fixture: ComponentFixture<HospitalOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
