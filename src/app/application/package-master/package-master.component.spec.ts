import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMasterComponent } from './package-master.component';

describe('PackageMasterComponent', () => {
  let component: PackageMasterComponent;
  let fixture: ComponentFixture<PackageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
