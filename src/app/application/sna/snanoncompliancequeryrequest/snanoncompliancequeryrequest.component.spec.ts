import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnanoncompliancequeryrequestComponent } from './snanoncompliancequeryrequest.component';

describe('SnanoncompliancequeryrequestComponent', () => {
  let component: SnanoncompliancequeryrequestComponent;
  let fixture: ComponentFixture<SnanoncompliancequeryrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnanoncompliancequeryrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnanoncompliancequeryrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
