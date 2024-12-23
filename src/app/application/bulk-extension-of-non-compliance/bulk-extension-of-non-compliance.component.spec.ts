import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkExtensionOfNonComplianceComponent } from './bulk-extension-of-non-compliance.component';

describe('BulkExtensionOfNonComplianceComponent', () => {
  let component: BulkExtensionOfNonComplianceComponent;
  let fixture: ComponentFixture<BulkExtensionOfNonComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkExtensionOfNonComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkExtensionOfNonComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
