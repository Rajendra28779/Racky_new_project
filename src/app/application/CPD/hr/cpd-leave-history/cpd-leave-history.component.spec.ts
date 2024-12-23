import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdLeaveHistoryComponent } from './cpd-leave-history.component';

describe('CpdLeaveHistoryComponent', () => {
  let component: CpdLeaveHistoryComponent;
  let fixture: ComponentFixture<CpdLeaveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdLeaveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdLeaveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
