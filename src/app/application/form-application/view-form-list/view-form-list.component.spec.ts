import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormListComponent } from './view-form-list.component';

describe('ViewFormListComponent', () => {
  let component: ViewFormListComponent;
  let fixture: ComponentFixture<ViewFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFormListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
