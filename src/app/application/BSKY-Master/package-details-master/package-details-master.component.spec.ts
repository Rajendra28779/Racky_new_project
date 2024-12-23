import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsMasterComponent } from './package-details-master.component';

describe('PackageDetailsMasterComponent', () => {
  let component: PackageDetailsMasterComponent;
  let fixture: ComponentFixture<PackageDetailsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageDetailsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
