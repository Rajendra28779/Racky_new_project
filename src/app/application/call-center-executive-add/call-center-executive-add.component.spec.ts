import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterExecutiveAddComponent } from './call-center-executive-add.component';

describe('CallCenterExecutiveAddComponent', () => {
  let component: CallCenterExecutiveAddComponent;
  let fixture: ComponentFixture<CallCenterExecutiveAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallCenterExecutiveAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterExecutiveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
