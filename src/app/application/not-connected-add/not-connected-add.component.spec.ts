import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedAddComponent } from './not-connected-add.component';

describe('NotConnectedAddComponent', () => {
  let component: NotConnectedAddComponent;
  let fixture: ComponentFixture<NotConnectedAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotConnectedAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
