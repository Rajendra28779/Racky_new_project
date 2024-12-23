import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSnaExecutiveComponent } from './view-sna-executive.component';

describe('ViewSnaExecutiveComponent', () => {
  let component: ViewSnaExecutiveComponent;
  let fixture: ComponentFixture<ViewSnaExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSnaExecutiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSnaExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
