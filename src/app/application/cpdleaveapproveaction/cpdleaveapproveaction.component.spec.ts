import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdleaveapproveactionComponent } from './cpdleaveapproveaction.component';

describe('CpdleaveapproveactionComponent', () => {
  let component: CpdleaveapproveactionComponent;
  let fixture: ComponentFixture<CpdleaveapproveactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdleaveapproveactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdleaveapproveactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
