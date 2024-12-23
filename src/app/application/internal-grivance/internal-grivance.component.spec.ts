import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalGrivanceComponent } from './internal-grivance.component';

describe('InternalGrivanceComponent', () => {
  let component: InternalGrivanceComponent;
  let fixture: ComponentFixture<InternalGrivanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalGrivanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalGrivanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
