import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCpdScheduleComponent } from './run-cpd-schedule.component';

describe('RunCpdScheduleComponent', () => {
  let component: RunCpdScheduleComponent;
  let fixture: ComponentFixture<RunCpdScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunCpdScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunCpdScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
