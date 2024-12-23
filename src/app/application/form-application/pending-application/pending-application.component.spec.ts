import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApplicationComponent } from './pending-application.component';

describe('PendingApplicationComponent', () => {
  let component: PendingApplicationComponent;
  let fixture: ComponentFixture<PendingApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
