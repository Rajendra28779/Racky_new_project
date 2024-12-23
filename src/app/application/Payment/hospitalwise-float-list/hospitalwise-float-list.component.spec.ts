import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalwiseFloatListComponent } from './hospitalwise-float-list.component';

describe('HospitalwiseFloatListComponent', () => {
  let component: HospitalwiseFloatListComponent;
  let fixture: ComponentFixture<HospitalwiseFloatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalwiseFloatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalwiseFloatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
