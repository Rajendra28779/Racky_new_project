import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdprofileComponent } from './cpdprofile.component';

describe('CpdprofileComponent', () => {
  let component: CpdprofileComponent;
  let fixture: ComponentFixture<CpdprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
