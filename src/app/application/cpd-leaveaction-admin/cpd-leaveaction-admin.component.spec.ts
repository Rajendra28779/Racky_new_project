import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdLeaveactionAdminComponent } from './cpd-leaveaction-admin.component';

describe('CpdLeaveactionAdminComponent', () => {
  let component: CpdLeaveactionAdminComponent;
  let fixture: ComponentFixture<CpdLeaveactionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdLeaveactionAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdLeaveactionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
