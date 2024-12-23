import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdwishospitalwisedetailspageComponent } from './cpdwishospitalwisedetailspage.component';

describe('CpdwishospitalwisedetailspageComponent', () => {
  let component: CpdwishospitalwisedetailspageComponent;
  let fixture: ComponentFixture<CpdwishospitalwisedetailspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdwishospitalwisedetailspageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdwishospitalwisedetailspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
