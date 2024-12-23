import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldprocessedclaimlistComponent } from './oldprocessedclaimlist.component';

describe('OldprocessedclaimlistComponent', () => {
  let component: OldprocessedclaimlistComponent;
  let fixture: ComponentFixture<OldprocessedclaimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldprocessedclaimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldprocessedclaimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
