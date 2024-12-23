import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksAddComponent } from './remarks-add.component';

describe('RemarksAddComponent', () => {
  let component: RemarksAddComponent;
  let fixture: ComponentFixture<RemarksAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarksAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarksAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
