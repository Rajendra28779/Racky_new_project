import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcapprovalComponent } from './dcapproval.component';

describe('DcapprovalComponent', () => {
  let component: DcapprovalComponent;
  let fixture: ComponentFixture<DcapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcapprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
