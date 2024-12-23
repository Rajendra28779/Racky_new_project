import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalcommTaskComponent } from './internalcomm-task.component';

describe('InternalcommTaskComponent', () => {
  let component: InternalcommTaskComponent;
  let fixture: ComponentFixture<InternalcommTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalcommTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalcommTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
