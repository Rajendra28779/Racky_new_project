import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalwiseCcedataComponent } from './hospitalwise-ccedata.component';

describe('HospitalwiseCcedataComponent', () => {
  let component: HospitalwiseCcedataComponent;
  let fixture: ComponentFixture<HospitalwiseCcedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalwiseCcedataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalwiseCcedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
