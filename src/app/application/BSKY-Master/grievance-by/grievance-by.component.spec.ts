import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceByComponent } from './grievance-by.component';

describe('GrievanceByComponent', () => {
  let component: GrievanceByComponent;
  let fixture: ComponentFixture<GrievanceByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
