import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdrejectlisthospitaldetailsComponent } from './cpdrejectlisthospitaldetails.component';

describe('CpdrejectlisthospitaldetailsComponent', () => {
  let component: CpdrejectlisthospitaldetailsComponent;
  let fixture: ComponentFixture<CpdrejectlisthospitaldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdrejectlisthospitaldetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdrejectlisthospitaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
