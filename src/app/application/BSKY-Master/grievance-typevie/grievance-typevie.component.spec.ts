import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceTypevieComponent } from './grievance-typevie.component';

describe('GrievanceTypevieComponent', () => {
  let component: GrievanceTypevieComponent;
  let fixture: ComponentFixture<GrievanceTypevieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceTypevieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceTypevieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
