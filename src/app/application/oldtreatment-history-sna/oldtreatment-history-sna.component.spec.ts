import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldtreatmentHistorySNAComponent } from './oldtreatment-history-sna.component';

describe('OldtreatmentHistorySNAComponent', () => {
  let component: OldtreatmentHistorySNAComponent;
  let fixture: ComponentFixture<OldtreatmentHistorySNAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldtreatmentHistorySNAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldtreatmentHistorySNAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
