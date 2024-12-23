import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentHistoryPackageComponent } from './treatment-history-package.component';

describe('TreatmentHistoryPackageComponent', () => {
  let component: TreatmentHistoryPackageComponent;
  let fixture: ComponentFixture<TreatmentHistoryPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentHistoryPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentHistoryPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
