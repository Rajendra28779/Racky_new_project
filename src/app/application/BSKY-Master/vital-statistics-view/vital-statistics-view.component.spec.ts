import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalStatisticsViewComponent } from './vital-statistics-view.component';

describe('VitalStatisticsViewComponent', () => {
  let component: VitalStatisticsViewComponent;
  let fixture: ComponentFixture<VitalStatisticsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalStatisticsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalStatisticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
