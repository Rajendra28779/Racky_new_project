import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimstatictiscDetailsComponent } from './claimstatictisc-details.component';

describe('ClaimstatictiscDetailsComponent', () => {
  let component: ClaimstatictiscDetailsComponent;
  let fixture: ComponentFixture<ClaimstatictiscDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimstatictiscDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimstatictiscDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
