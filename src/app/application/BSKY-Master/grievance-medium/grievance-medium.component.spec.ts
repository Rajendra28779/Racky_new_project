import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceMediumComponent } from './grievance-medium.component';

describe('GrievanceMediumComponent', () => {
  let component: GrievanceMediumComponent;
  let fixture: ComponentFixture<GrievanceMediumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceMediumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
