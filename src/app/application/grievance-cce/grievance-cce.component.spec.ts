import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceCCEComponent } from './grievance-cce.component';

describe('GrievanceCCEComponent', () => {
  let component: GrievanceCCEComponent;
  let fixture: ComponentFixture<GrievanceCCEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceCCEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceCCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
