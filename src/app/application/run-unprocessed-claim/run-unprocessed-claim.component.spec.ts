import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunUnprocessedClaimComponent } from './run-unprocessed-claim.component';

describe('RunUnprocessedClaimComponent', () => {
  let component: RunUnprocessedClaimComponent;
  let fixture: ComponentFixture<RunUnprocessedClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunUnprocessedClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunUnprocessedClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
