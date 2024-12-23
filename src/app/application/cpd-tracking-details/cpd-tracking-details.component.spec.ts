import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdTrackingDetailsComponent } from './cpd-tracking-details.component';

describe('CpdTrackingDetailsComponent', () => {
  let component: CpdTrackingDetailsComponent;
  let fixture: ComponentFixture<CpdTrackingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdTrackingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdTrackingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
