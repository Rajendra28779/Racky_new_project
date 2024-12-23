import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupViewComponent } from './usergroup-view.component';

describe('UsergroupViewComponent', () => {
  let component: UsergroupViewComponent;
  let fixture: ComponentFixture<UsergroupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsergroupViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsergroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
