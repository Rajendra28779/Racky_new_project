import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceExtnComponent } from './non-compliance-extn.component';

describe('NonComplianceExtnComponent', () => {
  let component: NonComplianceExtnComponent;
  let fixture: ComponentFixture<NonComplianceExtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonComplianceExtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceExtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
