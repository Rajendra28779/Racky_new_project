import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionWiseFloatGenerationComponent } from './action-wise-float-generation.component';

describe('ActionWiseFloatGenerationComponent', () => {
  let component: ActionWiseFloatGenerationComponent;
  let fixture: ComponentFixture<ActionWiseFloatGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionWiseFloatGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionWiseFloatGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
