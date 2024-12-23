import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdwiseunprocessedComponent } from './cpdwiseunprocessed.component';

describe('CpdwiseunprocessedComponent', () => {
  let component: CpdwiseunprocessedComponent;
  let fixture: ComponentFixture<CpdwiseunprocessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdwiseunprocessedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdwiseunprocessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
