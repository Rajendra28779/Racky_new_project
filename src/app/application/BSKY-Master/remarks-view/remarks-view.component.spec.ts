import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksViewComponent } from './remarks-view.component';

describe('RemarksViewComponent', () => {
  let component: RemarksViewComponent;
  let fixture: ComponentFixture<RemarksViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarksViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
