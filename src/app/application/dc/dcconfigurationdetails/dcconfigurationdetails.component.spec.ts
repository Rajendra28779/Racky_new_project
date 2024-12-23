import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcconfigurationdetailsComponent } from './dcconfigurationdetails.component';

describe('DcconfigurationdetailsComponent', () => {
  let component: DcconfigurationdetailsComponent;
  let fixture: ComponentFixture<DcconfigurationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcconfigurationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcconfigurationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
