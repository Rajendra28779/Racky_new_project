import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignAddComponent } from './re-assign-add.component';

describe('ReAssignAddComponent', () => {
  let component: ReAssignAddComponent;
  let fixture: ComponentFixture<ReAssignAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReAssignAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
