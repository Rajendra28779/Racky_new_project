import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdactiontakenlogdetailsComponent } from './cpdactiontakenlogdetails.component';

describe('CpdactiontakenlogdetailsComponent', () => {
  let component: CpdactiontakenlogdetailsComponent;
  let fixture: ComponentFixture<CpdactiontakenlogdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdactiontakenlogdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdactiontakenlogdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
