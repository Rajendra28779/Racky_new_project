import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgoCallCenterViewComponent } from './dgo-call-center-view.component';

describe('DgoCallCenterViewComponent', () => {
  let component: DgoCallCenterViewComponent;
  let fixture: ComponentFixture<DgoCallCenterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgoCallCenterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgoCallCenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
