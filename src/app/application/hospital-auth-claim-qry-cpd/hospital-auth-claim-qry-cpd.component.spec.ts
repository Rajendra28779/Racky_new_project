import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAuthClaimQryCPDComponent } from './hospital-auth-claim-qry-cpd.component';

describe('HospitalAuthClaimQryCPDComponent', () => {
  let component: HospitalAuthClaimQryCPDComponent;
  let fixture: ComponentFixture<HospitalAuthClaimQryCPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalAuthClaimQryCPDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAuthClaimQryCPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
