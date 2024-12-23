import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAuthClaimQrySNAComponent } from './hospital-auth-claim-qry-sna.component';

describe('HospitalAuthClaimQrySNAComponent', () => {
  let component: HospitalAuthClaimQrySNAComponent;
  let fixture: ComponentFixture<HospitalAuthClaimQrySNAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalAuthClaimQrySNAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAuthClaimQrySNAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
