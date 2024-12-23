import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHospitalComponent } from './user-hospital.component';

describe('UserHospitalComponent', () => {
  let component: UserHospitalComponent;
  let fixture: ComponentFixture<UserHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
