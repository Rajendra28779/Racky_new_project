import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdmoconfigurationdetailsComponent } from './cdmoconfigurationdetails.component';

describe('CdmoconfigurationdetailsComponent', () => {
  let component: CdmoconfigurationdetailsComponent;
  let fixture: ComponentFixture<CdmoconfigurationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdmoconfigurationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdmoconfigurationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
