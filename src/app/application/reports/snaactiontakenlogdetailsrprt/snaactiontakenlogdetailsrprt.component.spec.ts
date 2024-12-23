import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaactiontakenlogdetailsrprtComponent } from './snaactiontakenlogdetailsrprt.component';

describe('SnaactiontakenlogdetailsrprtComponent', () => {
  let component: SnaactiontakenlogdetailsrprtComponent;
  let fixture: ComponentFixture<SnaactiontakenlogdetailsrprtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaactiontakenlogdetailsrprtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaactiontakenlogdetailsrprtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
