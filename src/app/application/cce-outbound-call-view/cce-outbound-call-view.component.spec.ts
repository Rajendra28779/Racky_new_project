import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CceOutboundCallViewComponent } from './cce-outbound-call-view.component';

describe('CceOutboundCallViewComponent', () => {
  let component: CceOutboundCallViewComponent;
  let fixture: ComponentFixture<CceOutboundCallViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CceOutboundCallViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CceOutboundCallViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
