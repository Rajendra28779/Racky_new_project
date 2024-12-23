import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdMultiPackageBlockingComponent } from './cpd-multi-package-blocking.component';

describe('CpdMultiPackageBlockingComponent', () => {
  let component: CpdMultiPackageBlockingComponent;
  let fixture: ComponentFixture<CpdMultiPackageBlockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdMultiPackageBlockingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdMultiPackageBlockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
