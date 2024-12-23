import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedViewComponent } from './not-connected-view.component';

describe('NotConnectedViewComponent', () => {
  let component: NotConnectedViewComponent;
  let fixture: ComponentFixture<NotConnectedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotConnectedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
