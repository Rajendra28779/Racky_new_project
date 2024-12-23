import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdLeaveviewAdminComponent } from './cpd-leaveview-admin.component';

describe('CpdLeaveviewAdminComponent', () => {
  let component: CpdLeaveviewAdminComponent;
  let fixture: ComponentFixture<CpdLeaveviewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdLeaveviewAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdLeaveviewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
