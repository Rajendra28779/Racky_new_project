import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSubCatagoryComponent } from './package-sub-catagory.component';

describe('PackageSubCatagoryComponent', () => {
  let component: PackageSubCatagoryComponent;
  let fixture: ComponentFixture<PackageSubCatagoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageSubCatagoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSubCatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
