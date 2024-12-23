import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighEndDrugsComponent } from './high-end-drugs.component';

describe('HighEndDrugsComponent', () => {
  let component: HighEndDrugsComponent;
  let fixture: ComponentFixture<HighEndDrugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighEndDrugsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighEndDrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
