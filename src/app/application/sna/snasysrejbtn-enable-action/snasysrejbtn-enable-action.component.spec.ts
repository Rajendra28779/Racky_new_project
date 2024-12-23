import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnasysrejbtnEnableActionComponent } from './snasysrejbtn-enable-action.component';

describe('SnasysrejbtnEnableActionComponent', () => {
  let component: SnasysrejbtnEnableActionComponent;
  let fixture: ComponentFixture<SnasysrejbtnEnableActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnasysrejbtnEnableActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnasysrejbtnEnableActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
