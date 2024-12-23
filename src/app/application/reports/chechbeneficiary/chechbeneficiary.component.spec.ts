import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChechbeneficiaryComponent } from './chechbeneficiary.component';

describe('ChechbeneficiaryComponent', () => {
  let component: ChechbeneficiaryComponent;
  let fixture: ComponentFixture<ChechbeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChechbeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChechbeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
