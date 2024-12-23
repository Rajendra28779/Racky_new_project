import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdmappingComponent } from './cpdmapping.component';

describe('CpdmappingComponent', () => {
  let component: CpdmappingComponent;
  let fixture: ComponentFixture<CpdmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdmappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
