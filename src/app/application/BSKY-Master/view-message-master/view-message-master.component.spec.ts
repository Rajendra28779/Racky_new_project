import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMessageMasterComponent } from './view-message-master.component';

describe('ViewMessageMasterComponent', () => {
  let component: ViewMessageMasterComponent;
  let fixture: ComponentFixture<ViewMessageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMessageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMessageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
