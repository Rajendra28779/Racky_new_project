import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcadminformComponent } from './qcadminform.component';

describe('QcadminformComponent', () => {
  let component: QcadminformComponent;
  let fixture: ComponentFixture<QcadminformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcadminformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcadminformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
