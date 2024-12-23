import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimcountprogressreportDetailsComponent } from './claimcountprogressreport-details.component';

describe('ClaimcountprogressreportDetailsComponent', () => {
  let component: ClaimcountprogressreportDetailsComponent;
  let fixture: ComponentFixture<ClaimcountprogressreportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimcountprogressreportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimcountprogressreportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
