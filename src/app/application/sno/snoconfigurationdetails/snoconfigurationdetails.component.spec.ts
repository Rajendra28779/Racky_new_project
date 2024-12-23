import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoconfigurationdetailsComponent } from './snoconfigurationdetails.component';

describe('SnoconfigurationdetailsComponent', () => {
  let component: SnoconfigurationdetailsComponent;
  let fixture: ComponentFixture<SnoconfigurationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnoconfigurationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoconfigurationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
