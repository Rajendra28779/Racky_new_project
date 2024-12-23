import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuHospitalMasterComponent } from './tsu-hospital-master.component';

describe('TsuHospitalMasterComponent', () => {
  let component: TsuHospitalMasterComponent;
  let fixture: ComponentFixture<TsuHospitalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuHospitalMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuHospitalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
