import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwathyaMitraHospitalConfigurationComponent } from './swathya-mitra-hospital-configuration.component';

describe('SwathyaMitraHospitalConfigurationComponent', () => {
  let component: SwathyaMitraHospitalConfigurationComponent;
  let fixture: ComponentFixture<SwathyaMitraHospitalConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwathyaMitraHospitalConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwathyaMitraHospitalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
