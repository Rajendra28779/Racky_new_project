import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldclaimquerybysnadetailsComponent } from './oldclaimquerybysnadetails.component';

describe('OldclaimquerybysnadetailsComponent', () => {
  let component: OldclaimquerybysnadetailsComponent;
  let fixture: ComponentFixture<OldclaimquerybysnadetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldclaimquerybysnadetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldclaimquerybysnadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
