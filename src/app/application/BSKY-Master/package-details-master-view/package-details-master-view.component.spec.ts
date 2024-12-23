import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsMasterViewComponent } from './package-details-master-view.component';

describe('PackageDetailsMasterViewComponent', () => {
  let component: PackageDetailsMasterViewComponent;
  let fixture: ComponentFixture<PackageDetailsMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageDetailsMasterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailsMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
