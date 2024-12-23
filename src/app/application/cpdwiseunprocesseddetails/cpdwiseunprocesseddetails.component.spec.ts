import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdwiseunprocesseddetailsComponent } from './cpdwiseunprocesseddetails.component';

describe('CpdwiseunprocesseddetailsComponent', () => {
  let component: CpdwiseunprocesseddetailsComponent;
  let fixture: ComponentFixture<CpdwiseunprocesseddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdwiseunprocesseddetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdwiseunprocesseddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
