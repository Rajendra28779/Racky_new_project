import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteingComponent } from './noteing.component';

describe('NoteingComponent', () => {
  let component: NoteingComponent;
  let fixture: ComponentFixture<NoteingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
