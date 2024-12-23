import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdnamewisedetailsComponent } from './cpdnamewisedetails.component';

describe('CpdnamewisedetailsComponent', () => {
  let component: CpdnamewisedetailsComponent;
  let fixture: ComponentFixture<CpdnamewisedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdnamewisedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdnamewisedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
