import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPackageMappingViewComponent } from './hospital-package-mapping-view.component';

describe('HospitalPackageMappingViewComponent', () => {
  let component: HospitalPackageMappingViewComponent;
  let fixture: ComponentFixture<HospitalPackageMappingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPackageMappingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPackageMappingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
