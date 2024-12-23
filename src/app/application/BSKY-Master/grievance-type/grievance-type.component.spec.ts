import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceTypeComponent } from './grievance-type.component';

describe('GrievanceTypeComponent', () => {
  let component: GrievanceTypeComponent;
  let fixture: ComponentFixture<GrievanceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
