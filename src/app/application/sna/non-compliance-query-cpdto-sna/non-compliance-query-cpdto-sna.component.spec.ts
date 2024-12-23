import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceQueryCPDToSNAComponent } from './non-compliance-query-cpdto-sna.component';

describe('NonComplianceQueryCPDToSNAComponent', () => {
  let component: NonComplianceQueryCPDToSNAComponent;
  let fixture: ComponentFixture<NonComplianceQueryCPDToSNAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonComplianceQueryCPDToSNAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceQueryCPDToSNAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
