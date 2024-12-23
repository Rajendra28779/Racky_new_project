import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwathyaMitraHospitalConfigurationViewComponent } from './swathya-mitra-hospital-configuration-view.component';

describe('SwathyaMitraHospitalConfigurationViewComponent', () => {
  let component: SwathyaMitraHospitalConfigurationViewComponent;
  let fixture: ComponentFixture<SwathyaMitraHospitalConfigurationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwathyaMitraHospitalConfigurationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwathyaMitraHospitalConfigurationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
