import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmhospitalconfigurationComponent } from './smhospitalconfiguration.component';

describe('SmhospitalconfigurationComponent', () => {
  let component: SmhospitalconfigurationComponent;
  let fixture: ComponentFixture<SmhospitalconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmhospitalconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmhospitalconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
