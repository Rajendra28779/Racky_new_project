import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeViewComponent } from './group-type-view.component';

describe('GroupTypeViewComponent', () => {
  let component: GroupTypeViewComponent;
  let fixture: ComponentFixture<GroupTypeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTypeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
