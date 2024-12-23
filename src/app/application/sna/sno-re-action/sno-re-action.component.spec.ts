import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoReActionComponent } from './sno-re-action.component';

describe('SnoReActionComponent', () => {
  let component: SnoReActionComponent;
  let fixture: ComponentFixture<SnoReActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnoReActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoReActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
