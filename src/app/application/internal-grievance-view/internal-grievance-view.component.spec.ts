import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalGrievanceViewComponent } from './internal-grievance-view.component';

describe('InternalGrievanceViewComponent', () => {
  let component: InternalGrievanceViewComponent;
  let fixture: ComponentFixture<InternalGrievanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalGrievanceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalGrievanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
