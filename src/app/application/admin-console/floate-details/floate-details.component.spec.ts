import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloateDetailsComponent } from './floate-details.component';

describe('FloateDetailsComponent', () => {
  let component: FloateDetailsComponent;
  let fixture: ComponentFixture<FloateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
