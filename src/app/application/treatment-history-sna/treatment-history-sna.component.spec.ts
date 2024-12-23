import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentHistorySnaComponent } from './treatment-history-sna.component';

describe('TreatmentHistorySnaComponent', () => {
  let component: TreatmentHistorySnaComponent;
  let fixture: ComponentFixture<TreatmentHistorySnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentHistorySnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentHistorySnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
