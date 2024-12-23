import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimquerybyCPDdetailsComponent } from './claimqueryby-cpddetails.component';

describe('ClaimquerybyCPDdetailsComponent', () => {
  let component: ClaimquerybyCPDdetailsComponent;
  let fixture: ComponentFixture<ClaimquerybyCPDdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimquerybyCPDdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimquerybyCPDdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
