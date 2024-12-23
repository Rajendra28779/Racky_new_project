import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInternalLoginComponent } from './admin-internal-login.component';

describe('AdminInternalLoginComponent', () => {
  let component: AdminInternalLoginComponent;
  let fixture: ComponentFixture<AdminInternalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInternalLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInternalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
