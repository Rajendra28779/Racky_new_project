import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceMediumViewComponent } from './grievance-medium-view.component';

describe('GrievanceMediumViewComponent', () => {
  let component: GrievanceMediumViewComponent;
  let fixture: ComponentFixture<GrievanceMediumViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceMediumViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceMediumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
