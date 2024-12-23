import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimquerybycpdComponent } from './claimquerybycpd.component';

describe('ClaimquerybycpdComponent', () => {
  let component: ClaimquerybycpdComponent;
  let fixture: ComponentFixture<ClaimquerybycpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimquerybycpdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimquerybycpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
