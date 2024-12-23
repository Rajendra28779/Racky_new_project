import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdleaveviewComponent } from './cpdleaveview.component';

describe('CpdleaveviewComponent', () => {
  let component: CpdleaveviewComponent;
  let fixture: ComponentFixture<CpdleaveviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdleaveviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdleaveviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
