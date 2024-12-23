import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHeaderComponent } from './package-header.component';

describe('PackageHeaderComponent', () => {
  let component: PackageHeaderComponent;
  let fixture: ComponentFixture<PackageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
