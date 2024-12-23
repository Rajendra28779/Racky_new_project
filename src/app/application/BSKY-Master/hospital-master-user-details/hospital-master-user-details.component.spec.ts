import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMasterUserDetailsComponent } from './hospital-master-user-details.component';

describe('HospitalMasterUserDetailsComponent', () => {
  let component: HospitalMasterUserDetailsComponent;
  let fixture: ComponentFixture<HospitalMasterUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMasterUserDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMasterUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
