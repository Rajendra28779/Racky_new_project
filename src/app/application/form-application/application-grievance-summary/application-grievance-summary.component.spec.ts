import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationGrievanceSummaryComponent } from './application-grievance-summary.component';

describe('ApplicationGrievanceSummaryComponent', () => {
  let component: ApplicationGrievanceSummaryComponent;
  let fixture: ComponentFixture<ApplicationGrievanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationGrievanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationGrievanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
