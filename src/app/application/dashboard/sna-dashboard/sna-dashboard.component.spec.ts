import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaDashboardComponent } from './sna-dashboard.component';

describe('SnaDashboardComponent', () => {
  let component: SnaDashboardComponent;
  let fixture: ComponentFixture<SnaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
