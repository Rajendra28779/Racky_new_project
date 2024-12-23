import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpOverrideViewComponent } from './fp-override-view.component';

describe('FpOverrideViewComponent', () => {
  let component: FpOverrideViewComponent;
  let fixture: ComponentFixture<FpOverrideViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FpOverrideViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FpOverrideViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
