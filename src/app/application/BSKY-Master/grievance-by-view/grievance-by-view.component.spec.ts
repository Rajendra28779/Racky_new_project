import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceByViewComponent } from './grievance-by-view.component';

describe('GrievanceByViewComponent', () => {
  let component: GrievanceByViewComponent;
  let fixture: ComponentFixture<GrievanceByViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceByViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceByViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
