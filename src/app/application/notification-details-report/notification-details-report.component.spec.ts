import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailsReportComponent } from './notification-details-report.component';

describe('NotificationDetailsReportComponent', () => {
  let component: NotificationDetailsReportComponent;
  let fixture: ComponentFixture<NotificationDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
