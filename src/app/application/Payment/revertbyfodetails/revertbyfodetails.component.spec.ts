import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertbyfodetailsComponent } from './revertbyfodetails.component';

describe('RevertbyfodetailsComponent', () => {
  let component: RevertbyfodetailsComponent;
  let fixture: ComponentFixture<RevertbyfodetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertbyfodetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertbyfodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
