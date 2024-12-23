import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnarejectedlistComponent } from './snarejectedlist.component';

describe('SnarejectedlistComponent', () => {
  let component: SnarejectedlistComponent;
  let fixture: ComponentFixture<SnarejectedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnarejectedlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnarejectedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
