import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdreceivedcountreportdetailsComponent } from './cpdreceivedcountreportdetails.component';

describe('CpdreceivedcountreportdetailsComponent', () => {
  let component: CpdreceivedcountreportdetailsComponent;
  let fixture: ComponentFixture<CpdreceivedcountreportdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdreceivedcountreportdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdreceivedcountreportdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
