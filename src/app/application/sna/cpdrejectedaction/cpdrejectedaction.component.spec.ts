import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdrejectedactionComponent } from './cpdrejectedaction.component';

describe('CpdrejectedactionComponent', () => {
  let component: CpdrejectedactionComponent;
  let fixture: ComponentFixture<CpdrejectedactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdrejectedactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdrejectedactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
