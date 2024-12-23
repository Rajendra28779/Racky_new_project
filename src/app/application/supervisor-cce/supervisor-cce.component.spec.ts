import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCceComponent } from './supervisor-cce.component';

describe('SupervisorCceComponent', () => {
  let component: SupervisorCceComponent;
  let fixture: ComponentFixture<SupervisorCceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorCceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
