import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntaggedHospitalsComponent } from './untagged-hospitals.component';

describe('UntaggedHospitalsComponent', () => {
  let component: UntaggedHospitalsComponent;
  let fixture: ComponentFixture<UntaggedHospitalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UntaggedHospitalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UntaggedHospitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
