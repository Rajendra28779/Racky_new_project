import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpOverrideCodeComponent } from './fp-override-code.component';

describe('FpOverrideCodeComponent', () => {
  let component: FpOverrideCodeComponent;
  let fixture: ComponentFixture<FpOverrideCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FpOverrideCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FpOverrideCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
