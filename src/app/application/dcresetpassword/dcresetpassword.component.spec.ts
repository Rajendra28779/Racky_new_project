import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcresetpasswordComponent } from './dcresetpassword.component';

describe('DcresetpasswordComponent', () => {
  let component: DcresetpasswordComponent;
  let fixture: ComponentFixture<DcresetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcresetpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcresetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
