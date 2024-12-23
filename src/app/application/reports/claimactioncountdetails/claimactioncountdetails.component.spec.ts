import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimactioncountdetailsComponent } from './claimactioncountdetails.component';

describe('ClaimactioncountdetailsComponent', () => {
  let component: ClaimactioncountdetailsComponent;
  let fixture: ComponentFixture<ClaimactioncountdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimactioncountdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimactioncountdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
