import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldclaimResettlementDetailsComponent } from './oldclaim-resettlement-details.component';

describe('OldclaimResettlementDetailsComponent', () => {
  let component: OldclaimResettlementDetailsComponent;
  let fixture: ComponentFixture<OldclaimResettlementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldclaimResettlementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldclaimResettlementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
