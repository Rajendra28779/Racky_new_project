import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMenuMappingComponent } from './group-menu-mapping.component';

describe('GroupMenuMappingComponent', () => {
  let component: GroupMenuMappingComponent;
  let fixture: ComponentFixture<GroupMenuMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMenuMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMenuMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
