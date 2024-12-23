import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalcommAddComponent } from './internalcomm-add.component';

describe('InternalcommAddComponent', () => {
  let component: InternalcommAddComponent;
  let fixture: ComponentFixture<InternalcommAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalcommAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalcommAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
