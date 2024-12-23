import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgoCallCenterComponent } from './dgo-call-center.component';

describe('DgoCallCenterComponent', () => {
  let component: DgoCallCenterComponent;
  let fixture: ComponentFixture<DgoCallCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgoCallCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgoCallCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
