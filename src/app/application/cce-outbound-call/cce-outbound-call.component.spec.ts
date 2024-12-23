import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CceOutboundCallComponent } from './cce-outbound-call.component';

describe('CceOutboundCallComponent', () => {
  let component: CceOutboundCallComponent;
  let fixture: ComponentFixture<CceOutboundCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CceOutboundCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CceOutboundCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
