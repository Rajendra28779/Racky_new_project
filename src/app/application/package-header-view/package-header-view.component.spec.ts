import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHeaderViewComponent } from './package-header-view.component';

describe('PackageHeaderViewComponent', () => {
  let component: PackageHeaderViewComponent;
  let fixture: ComponentFixture<PackageHeaderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageHeaderViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageHeaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
