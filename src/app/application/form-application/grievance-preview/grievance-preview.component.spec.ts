import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievancePreviewComponent } from './grievance-preview.component';

describe('GrievancePreviewComponent', () => {
  let component: GrievancePreviewComponent;
  let fixture: ComponentFixture<GrievancePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievancePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievancePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
