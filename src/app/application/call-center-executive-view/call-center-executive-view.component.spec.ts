import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterExecutiveViewComponent } from './call-center-executive-view.component';

describe('CallCenterExecutiveViewComponent', () => {
  let component: CallCenterExecutiveViewComponent;
  let fixture: ComponentFixture<CallCenterExecutiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallCenterExecutiveViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterExecutiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
