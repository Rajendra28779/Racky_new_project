import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubGroupComponent } from './user-sub-group.component';

describe('UserSubGroupComponent', () => {
  let component: UserSubGroupComponent;
  let fixture: ComponentFixture<UserSubGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSubGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
