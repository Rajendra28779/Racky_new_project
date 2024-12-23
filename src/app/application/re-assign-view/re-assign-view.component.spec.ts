import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignViewComponent } from './re-assign-view.component';

describe('ReAssignViewComponent', () => {
  let component: ReAssignViewComponent;
  let fixture: ComponentFixture<ReAssignViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReAssignViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
