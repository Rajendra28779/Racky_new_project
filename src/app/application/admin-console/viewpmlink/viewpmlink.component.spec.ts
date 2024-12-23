import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpmlinkComponent } from './viewpmlink.component';

describe('ViewpmlinkComponent', () => {
  let component: ViewpmlinkComponent;
  let fixture: ComponentFixture<ViewpmlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewpmlinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpmlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
