import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllNotificationComponent } from './show-all-notification.component';

describe('ShowAllNotificationComponent', () => {
  let component: ShowAllNotificationComponent;
  let fixture: ComponentFixture<ShowAllNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
