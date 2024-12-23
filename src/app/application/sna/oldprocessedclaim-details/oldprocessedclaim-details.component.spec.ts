import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldprocessedclaimDetailsComponent } from './oldprocessedclaim-details.component';

describe('OldprocessedclaimDetailsComponent', () => {
  let component: OldprocessedclaimDetailsComponent;
  let fixture: ComponentFixture<OldprocessedclaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldprocessedclaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldprocessedclaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
