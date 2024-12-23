import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractFloatGenerationComponent } from './abstract-float-generation.component';

describe('AbstractFloatGenerationComponent', () => {
  let component: AbstractFloatGenerationComponent;
  let fixture: ComponentFixture<AbstractFloatGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractFloatGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractFloatGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
