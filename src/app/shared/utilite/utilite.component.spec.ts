import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtiliteComponent } from './utilite.component';

describe('UtiliteComponent', () => {
  let component: UtiliteComponent;
  let fixture: ComponentFixture<UtiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtiliteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
