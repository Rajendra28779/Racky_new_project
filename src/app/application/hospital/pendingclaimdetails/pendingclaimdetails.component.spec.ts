import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingclaimdetailsComponent } from './pendingclaimdetails.component';

describe('PendingclaimdetailsComponent', () => {
  let component: PendingclaimdetailsComponent;
  let fixture: ComponentFixture<PendingclaimdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingclaimdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingclaimdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
