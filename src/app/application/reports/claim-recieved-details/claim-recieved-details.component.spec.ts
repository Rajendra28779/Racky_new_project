import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRecievedDetailsComponent } from './claim-recieved-details.component';

describe('ClaimRecievedDetailsComponent', () => {
  let component: ClaimRecievedDetailsComponent;
  let fixture: ComponentFixture<ClaimRecievedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRecievedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRecievedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
