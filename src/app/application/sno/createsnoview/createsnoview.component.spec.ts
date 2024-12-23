import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesnoviewComponent } from './createsnoview.component';

describe('CreatesnoviewComponent', () => {
  let component: CreatesnoviewComponent;
  let fixture: ComponentFixture<CreatesnoviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatesnoviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesnoviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
