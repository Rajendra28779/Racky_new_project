import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckcardbalanceComponent } from './checkcardbalance.component';

describe('CheckcardbalanceComponent', () => {
  let component: CheckcardbalanceComponent;
  let fixture: ComponentFixture<CheckcardbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckcardbalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckcardbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
