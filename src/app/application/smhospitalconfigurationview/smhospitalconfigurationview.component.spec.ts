import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmhospitalconfigurationviewComponent } from './smhospitalconfigurationview.component';

describe('SmhospitalconfigurationviewComponent', () => {
  let component: SmhospitalconfigurationviewComponent;
  let fixture: ComponentFixture<SmhospitalconfigurationviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmhospitalconfigurationviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmhospitalconfigurationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
