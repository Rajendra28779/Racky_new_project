import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnanoncompliancequeryrequestdetailsComponent } from './snanoncompliancequeryrequestdetails.component';

describe('SnanoncompliancequeryrequestdetailsComponent', () => {
  let component: SnanoncompliancequeryrequestdetailsComponent;
  let fixture: ComponentFixture<SnanoncompliancequeryrequestdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnanoncompliancequeryrequestdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnanoncompliancequeryrequestdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
