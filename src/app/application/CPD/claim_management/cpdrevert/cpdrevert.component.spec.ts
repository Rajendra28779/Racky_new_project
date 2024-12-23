import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdrevertComponent } from './cpdrevert.component';

describe('CpdrevertComponent', () => {
  let component: CpdrevertComponent;
  let fixture: ComponentFixture<CpdrevertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdrevertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdrevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
