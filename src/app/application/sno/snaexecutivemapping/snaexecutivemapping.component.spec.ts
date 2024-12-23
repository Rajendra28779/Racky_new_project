import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaexecutivemappingComponent } from './snaexecutivemapping.component';

describe('SnaexecutivemappingComponent', () => {
  let component: SnaexecutivemappingComponent;
  let fixture: ComponentFixture<SnaexecutivemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaexecutivemappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaexecutivemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
