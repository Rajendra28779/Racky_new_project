import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingGrievanceApplicationComponent } from './pending-grievance-application.component';

describe('PendingGrievanceApplicationComponent', () => {
  let component: PendingGrievanceApplicationComponent;
  let fixture: ComponentFixture<PendingGrievanceApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingGrievanceApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingGrievanceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
