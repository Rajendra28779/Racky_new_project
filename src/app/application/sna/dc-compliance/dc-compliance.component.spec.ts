import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComplianceComponent } from './dc-compliance.component';

describe('DcComplianceComponent', () => {
  let component: DcComplianceComponent;
  let fixture: ComponentFixture<DcComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
