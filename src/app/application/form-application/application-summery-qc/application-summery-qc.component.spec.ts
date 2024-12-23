import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSummeryQcComponent } from './application-summery-qc.component';

describe('ApplicationSummeryQcComponent', () => {
  let component: ApplicationSummeryQcComponent;
  let fixture: ComponentFixture<ApplicationSummeryQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationSummeryQcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSummeryQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
