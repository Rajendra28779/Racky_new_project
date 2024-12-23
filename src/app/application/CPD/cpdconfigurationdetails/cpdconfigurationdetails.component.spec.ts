import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdconfigurationdetailsComponent } from './cpdconfigurationdetails.component';

describe('CpdconfigurationdetailsComponent', () => {
  let component: CpdconfigurationdetailsComponent;
  let fixture: ComponentFixture<CpdconfigurationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdconfigurationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdconfigurationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
