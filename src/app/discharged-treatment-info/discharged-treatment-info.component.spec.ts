import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargedTreatmentInfoComponent } from './discharged-treatment-info.component';

describe('DischargedTreatmentInfoComponent', () => {
  let component: DischargedTreatmentInfoComponent;
  let fixture: ComponentFixture<DischargedTreatmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargedTreatmentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargedTreatmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
