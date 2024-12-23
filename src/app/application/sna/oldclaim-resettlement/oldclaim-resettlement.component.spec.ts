import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldclaimResettlementComponent } from './oldclaim-resettlement.component';

describe('OldclaimResettlementComponent', () => {
  let component: OldclaimResettlementComponent;
  let fixture: ComponentFixture<OldclaimResettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldclaimResettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldclaimResettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
