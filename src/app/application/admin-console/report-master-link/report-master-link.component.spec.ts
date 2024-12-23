import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMasterLinkComponent } from './report-master-link.component';

describe('ReportMasterLinkComponent', () => {
  let component: ReportMasterLinkComponent;
  let fixture: ComponentFixture<ReportMasterLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMasterLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMasterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
