import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdDashboardComponent } from './cpd-dashboard.component';

describe('CpdDashboardComponent', () => {
  let component: CpdDashboardComponent;
  let fixture: ComponentFixture<CpdDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
