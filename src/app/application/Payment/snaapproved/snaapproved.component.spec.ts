import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaapprovedComponent } from './snaapproved.component';

describe('SnaapprovedComponent', () => {
  let component: SnaapprovedComponent;
  let fixture: ComponentFixture<SnaapprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaapprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaapprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
