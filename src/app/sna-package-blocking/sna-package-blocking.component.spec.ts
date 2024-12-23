import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaPackageBlockingComponent } from './sna-package-blocking.component';

describe('SnaPackageBlockingComponent', () => {
  let component: SnaPackageBlockingComponent;
  let fixture: ComponentFixture<SnaPackageBlockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaPackageBlockingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaPackageBlockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
