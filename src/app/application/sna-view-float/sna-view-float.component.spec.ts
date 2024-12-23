import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaViewFloatComponent } from './sna-view-float.component';

describe('SnaViewFloatComponent', () => {
  let component: SnaViewFloatComponent;
  let fixture: ComponentFixture<SnaViewFloatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaViewFloatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaViewFloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
