import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatListComponent } from './float-list.component';

describe('FloatListComponent', () => {
  let component: FloatListComponent;
  let fixture: ComponentFixture<FloatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
