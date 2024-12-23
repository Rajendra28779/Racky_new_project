import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnarejectlisthospitaldetailsComponent } from './snarejectlisthospitaldetails.component';

describe('SnarejectlisthospitaldetailsComponent', () => {
  let component: SnarejectlisthospitaldetailsComponent;
  let fixture: ComponentFixture<SnarejectlisthospitaldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnarejectlisthospitaldetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnarejectlisthospitaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
