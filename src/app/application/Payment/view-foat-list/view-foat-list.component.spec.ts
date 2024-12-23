import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoatListComponent } from './view-foat-list.component';

describe('ViewFoatListComponent', () => {
  let component: ViewFoatListComponent;
  let fixture: ComponentFixture<ViewFoatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFoatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
