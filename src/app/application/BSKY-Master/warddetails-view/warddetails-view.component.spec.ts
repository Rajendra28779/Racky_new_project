import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarddetailsViewComponent } from './warddetails-view.component';

describe('WarddetailsViewComponent', () => {
  let component: WarddetailsViewComponent;
  let fixture: ComponentFixture<WarddetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarddetailsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarddetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
