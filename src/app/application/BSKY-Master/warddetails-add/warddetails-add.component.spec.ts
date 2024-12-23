import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarddetailsAddComponent } from './warddetails-add.component';

describe('WarddetailsAddComponent', () => {
  let component: WarddetailsAddComponent;
  let fixture: ComponentFixture<WarddetailsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarddetailsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarddetailsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
