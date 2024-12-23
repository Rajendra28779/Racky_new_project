import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSubcatagoryViewComponent } from './package-subcatagory-view.component';

describe('PackageSubcatagoryViewComponent', () => {
  let component: PackageSubcatagoryViewComponent;
  let fixture: ComponentFixture<PackageSubcatagoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageSubcatagoryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSubcatagoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
