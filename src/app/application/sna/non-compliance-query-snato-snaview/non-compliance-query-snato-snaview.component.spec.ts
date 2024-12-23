import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceQuerySNAToSNAViewComponent } from './non-compliance-query-snato-snaview.component';

describe('NonComplianceQuerySNAToSNAViewComponent', () => {
  let component: NonComplianceQuerySNAToSNAViewComponent;
  let fixture: ComponentFixture<NonComplianceQuerySNAToSNAViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonComplianceQuerySNAToSNAViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceQuerySNAToSNAViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
