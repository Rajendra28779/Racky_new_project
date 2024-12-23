import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatgenerationComponent } from './floatgeneration.component';

describe('FloatgenerationComponent', () => {
  let component: FloatgenerationComponent;
  let fixture: ComponentFixture<FloatgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatgenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
