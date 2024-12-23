import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCceViewComponent } from './supervisor-cce-view.component';

describe('SupervisorCceViewComponent', () => {
  let component: SupervisorCceViewComponent;
  let fixture: ComponentFixture<SupervisorCceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorCceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
