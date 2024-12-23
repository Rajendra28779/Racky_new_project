import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrnwiseactionComponent } from './urnwiseaction.component';

describe('UrnwiseactionComponent', () => {
  let component: UrnwiseactionComponent;
  let fixture: ComponentFixture<UrnwiseactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrnwiseactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrnwiseactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
