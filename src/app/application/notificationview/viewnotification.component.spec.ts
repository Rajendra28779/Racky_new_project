import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewnotificationComponent } from './viewnotification.component';

describe('ViewnotificationComponent', () => {
  let component: ViewnotificationComponent;
  let fixture: ComponentFixture<ViewnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewnotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
