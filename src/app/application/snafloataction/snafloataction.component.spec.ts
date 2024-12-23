import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnafloatactionComponent } from './snafloataction.component';

describe('SnafloatactionComponent', () => {
  let component: SnafloatactionComponent;
  let fixture: ComponentFixture<SnafloatactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnafloatactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnafloatactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
