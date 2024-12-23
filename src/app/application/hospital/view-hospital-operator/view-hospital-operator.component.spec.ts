import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHospitalOperatorComponent } from './view-hospital-operator.component';

describe('ViewHospitalOperatorComponent', () => {
  let component: ViewHospitalOperatorComponent;
  let fixture: ComponentFixture<ViewHospitalOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHospitalOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHospitalOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
