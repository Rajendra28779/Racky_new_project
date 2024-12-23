import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfnmasterComponent } from './viewfnmaster.component';

describe('ViewfnmasterComponent', () => {
  let component: ViewfnmasterComponent;
  let fixture: ComponentFixture<ViewfnmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewfnmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfnmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
