import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceQuerySNAToSNAComponent } from './non-compliance-query-snato-sna.component';

describe('NonComplianceQuerySNAToSNAComponent', () => {
  let component: NonComplianceQuerySNAToSNAComponent;
  let fixture: ComponentFixture<NonComplianceQuerySNAToSNAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonComplianceQuerySNAToSNAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceQuerySNAToSNAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
