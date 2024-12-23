import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighEndDrugsViewComponent } from './high-end-drugs-view.component';

describe('HighEndDrugsViewComponent', () => {
  let component: HighEndDrugsViewComponent;
  let fixture: ComponentFixture<HighEndDrugsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighEndDrugsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighEndDrugsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
