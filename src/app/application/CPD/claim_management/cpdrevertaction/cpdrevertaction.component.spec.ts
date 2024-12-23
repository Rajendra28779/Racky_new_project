import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdrevertactionComponent } from './cpdrevertaction.component';

describe('CpdrevertactionComponent', () => {
  let component: CpdrevertactionComponent;
  let fixture: ComponentFixture<CpdrevertactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdrevertactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdrevertactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
