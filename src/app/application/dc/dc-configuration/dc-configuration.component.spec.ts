import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcConfigurationComponent } from './dc-configuration.component';

describe('DcConfigurationComponent', () => {
  let component: DcConfigurationComponent;
  let fixture: ComponentFixture<DcConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
