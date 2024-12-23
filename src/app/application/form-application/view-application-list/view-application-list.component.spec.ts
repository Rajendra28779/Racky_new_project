import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationListComponent } from './view-application-list.component';

describe('ViewApplicationListComponent', () => {
  let component: ViewApplicationListComponent;
  let fixture: ComponentFixture<ViewApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApplicationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
