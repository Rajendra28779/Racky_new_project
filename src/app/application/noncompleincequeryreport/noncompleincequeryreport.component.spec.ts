import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoncompleincequeryreportComponent } from './noncompleincequeryreport.component';

describe('NoncompleincequeryreportComponent', () => {
  let component: NoncompleincequeryreportComponent;
  let fixture: ComponentFixture<NoncompleincequeryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoncompleincequeryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoncompleincequeryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
