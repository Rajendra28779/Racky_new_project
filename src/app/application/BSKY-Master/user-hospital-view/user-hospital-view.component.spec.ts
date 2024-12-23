import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHospitalViewComponent } from './user-hospital-view.component';

describe('UserHospitalViewComponent', () => {
  let component: UserHospitalViewComponent;
  let fixture: ComponentFixture<UserHospitalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHospitalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHospitalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
