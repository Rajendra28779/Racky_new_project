import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMasterViewComponent } from './package-master-view.component';

describe('PackageMasterViewComponent', () => {
  let component: PackageMasterViewComponent;
  let fixture: ComponentFixture<PackageMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageMasterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
