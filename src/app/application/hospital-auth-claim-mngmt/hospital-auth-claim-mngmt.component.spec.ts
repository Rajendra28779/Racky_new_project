import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAuthClaimMngmtComponent } from './hospital-auth-claim-mngmt.component';

describe('HospitalAuthClaimMngmtComponent', () => {
  let component: HospitalAuthClaimMngmtComponent;
  let fixture: ComponentFixture<HospitalAuthClaimMngmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalAuthClaimMngmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAuthClaimMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
