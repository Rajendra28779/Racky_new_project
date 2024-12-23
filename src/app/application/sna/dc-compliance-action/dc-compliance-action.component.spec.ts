import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComplianceActionComponent } from './dc-compliance-action.component';

describe('DcComplianceActionComponent', () => {
  let component: DcComplianceActionComponent;
  let fixture: ComponentFixture<DcComplianceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcComplianceActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcComplianceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
