import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatdetailsComponent } from './floatdetails.component';

describe('FloatdetailsComponent', () => {
  let component: FloatdetailsComponent;
  let fixture: ComponentFixture<FloatdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
