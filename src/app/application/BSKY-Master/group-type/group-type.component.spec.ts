import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeComponent } from './group-type.component';

describe('GroupTypeComponent', () => {
  let component: GroupTypeComponent;
  let fixture: ComponentFixture<GroupTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
