import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceTakeActionComponent } from './grievance-take-action.component';

describe('GrievanceTakeActionComponent', () => {
  let component: GrievanceTakeActionComponent;
  let fixture: ComponentFixture<GrievanceTakeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceTakeActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceTakeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
