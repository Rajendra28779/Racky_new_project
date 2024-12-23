import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreauthApprovalComponent } from './preauth-approval.component';

describe('PreauthApprovalComponent', () => {
  let component: PreauthApprovalComponent;
  let fixture: ComponentFixture<PreauthApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreauthApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreauthApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
