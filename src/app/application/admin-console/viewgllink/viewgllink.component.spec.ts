import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewgllinkComponent } from './viewgllink.component';

describe('ViewgllinkComponent', () => {
  let component: ViewgllinkComponent;
  let fixture: ComponentFixture<ViewgllinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewgllinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewgllinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
