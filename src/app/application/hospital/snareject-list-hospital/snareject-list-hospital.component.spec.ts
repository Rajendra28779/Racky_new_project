import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SNARejectListHospitalComponent } from './snareject-list-hospital.component';

describe('SNARejectListHospitalComponent', () => {
  let component: SNARejectListHospitalComponent;
  let fixture: ComponentFixture<SNARejectListHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SNARejectListHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SNARejectListHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
