import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreauthApprovalComponent } from './view-preauth-approval.component';

describe('ViewPreauthApprovalComponent', () => {
  let component: ViewPreauthApprovalComponent;
  let fixture: ComponentFixture<ViewPreauthApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPreauthApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreauthApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
