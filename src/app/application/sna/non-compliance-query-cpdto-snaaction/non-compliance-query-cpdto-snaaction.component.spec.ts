import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceQueryCPDToSNAActionComponent } from './non-compliance-query-cpdto-snaaction.component';

describe('NonComplianceQueryCPDToSNAActionComponent', () => {
  let component: NonComplianceQueryCPDToSNAActionComponent;
  let fixture: ComponentFixture<NonComplianceQueryCPDToSNAActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonComplianceQueryCPDToSNAActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceQueryCPDToSNAActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
