import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalStatisticsComponent } from './vital-statistics.component';

describe('VitalStatisticsComponent', () => {
  let component: VitalStatisticsComponent;
  let fixture: ComponentFixture<VitalStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
