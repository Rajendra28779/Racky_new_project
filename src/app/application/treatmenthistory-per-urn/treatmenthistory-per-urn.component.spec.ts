import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmenthistoryPerUrnComponent } from './treatmenthistory-per-urn.component';

describe('TreatmenthistoryPerUrnComponent', () => {
  let component: TreatmenthistoryPerUrnComponent;
  let fixture: ComponentFixture<TreatmenthistoryPerUrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmenthistoryPerUrnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmenthistoryPerUrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
