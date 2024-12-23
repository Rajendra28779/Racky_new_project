import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMasterUserComponent } from './hospital-master-user.component';

describe('HospitalMasterUserComponent', () => {
  let component: HospitalMasterUserComponent;
  let fixture: ComponentFixture<HospitalMasterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMasterUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMasterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
