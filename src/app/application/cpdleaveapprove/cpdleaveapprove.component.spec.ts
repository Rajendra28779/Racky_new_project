import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdleaveapproveComponent } from './cpdleaveapprove.component';

describe('CpdleaveapproveComponent', () => {
  let component: CpdleaveapproveComponent;
  let fixture: ComponentFixture<CpdleaveapproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdleaveapproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdleaveapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
