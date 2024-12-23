import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmenthistoryPerUrnPackageComponent } from './treatmenthistory-per-urn-package.component';

describe('TreatmenthistoryPerUrnPackageComponent', () => {
  let component: TreatmenthistoryPerUrnPackageComponent;
  let fixture: ComponentFixture<TreatmenthistoryPerUrnPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmenthistoryPerUrnPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmenthistoryPerUrnPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
