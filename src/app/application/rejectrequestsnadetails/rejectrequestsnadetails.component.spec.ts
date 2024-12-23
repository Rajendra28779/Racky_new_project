import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectrequestsnadetailsComponent } from './rejectrequestsnadetails.component';

describe('RejectrequestsnadetailsComponent', () => {
  let component: RejectrequestsnadetailsComponent;
  let fixture: ComponentFixture<RejectrequestsnadetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectrequestsnadetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectrequestsnadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
