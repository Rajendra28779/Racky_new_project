import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceApplicationSummaryComponent } from './grievance-application-summary.component';

describe('GrievanceApplicationSummaryComponent', () => {
  let component: GrievanceApplicationSummaryComponent;
  let fixture: ComponentFixture<GrievanceApplicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceApplicationSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceApplicationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
