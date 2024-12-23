import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdLeaveActionComponent } from './cpd-leave-action.component';

describe('CpdLeaveActionComponent', () => {
  let component: CpdLeaveActionComponent;
  let fixture: ComponentFixture<CpdLeaveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdLeaveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdLeaveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
