import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnasysrejbtnEnableComponent } from './snasysrejbtn-enable.component';

describe('SnasysrejbtnEnableComponent', () => {
  let component: SnasysrejbtnEnableComponent;
  let fixture: ComponentFixture<SnasysrejbtnEnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnasysrejbtnEnableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnasysrejbtnEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
