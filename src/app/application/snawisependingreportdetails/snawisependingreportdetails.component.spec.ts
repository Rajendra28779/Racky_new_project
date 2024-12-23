import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnawisependingreportdetailsComponent } from './snawisependingreportdetails.component';

describe('SnawisependingreportdetailsComponent', () => {
  let component: SnawisependingreportdetailsComponent;
  let fixture: ComponentFixture<SnawisependingreportdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnawisependingreportdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnawisependingreportdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
