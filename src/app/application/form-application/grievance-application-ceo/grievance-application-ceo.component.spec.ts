import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceApplicationCeoComponent } from './grievance-application-ceo.component';

describe('GrievanceApplicationCeoComponent', () => {
  let component: GrievanceApplicationCeoComponent;
  let fixture: ComponentFixture<GrievanceApplicationCeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceApplicationCeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceApplicationCeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
