import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentHistoryCpdComponent } from './treatment-history-cpd.component';

describe('TreatmentHistoryCpdComponent', () => {
  let component: TreatmentHistoryCpdComponent;
  let fixture: ComponentFixture<TreatmentHistoryCpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentHistoryCpdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentHistoryCpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
