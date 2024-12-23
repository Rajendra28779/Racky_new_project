import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingClaimSnareportsComponent } from './pending-claim-snareports.component';

describe('PendingClaimSnareportsComponent', () => {
  let component: PendingClaimSnareportsComponent;
  let fixture: ComponentFixture<PendingClaimSnareportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingClaimSnareportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingClaimSnareportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
