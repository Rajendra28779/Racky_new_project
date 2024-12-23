import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalcommViewComponent } from './internalcomm-view.component';

describe('InternalcommViewComponent', () => {
  let component: InternalcommViewComponent;
  let fixture: ComponentFixture<InternalcommViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalcommViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalcommViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
