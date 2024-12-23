import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPackageMappingComponent } from './hospital-package-mapping.component';

describe('HospitalPackageMappingComponent', () => {
  let component: HospitalPackageMappingComponent;
  let fixture: ComponentFixture<HospitalPackageMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPackageMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPackageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
