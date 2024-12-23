import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceCCEViewComponent } from './grievance-cce-view.component';

describe('GrievanceCCEViewComponent', () => {
  let component: GrievanceCCEViewComponent;
  let fixture: ComponentFixture<GrievanceCCEViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceCCEViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceCCEViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
