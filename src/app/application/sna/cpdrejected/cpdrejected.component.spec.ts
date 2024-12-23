import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdrejectedComponent } from './cpdrejected.component';

describe('CpdrejectedComponent', () => {
  let component: CpdrejectedComponent;
  let fixture: ComponentFixture<CpdrejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdrejectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdrejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
