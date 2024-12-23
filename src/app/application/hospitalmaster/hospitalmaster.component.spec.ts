import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalmasterComponent } from './hospitalmaster.component';

describe('HospitalmasterComponent', () => {
  let component: HospitalmasterComponent;
  let fixture: ComponentFixture<HospitalmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
