import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPDConfigurationComponent } from './cpdconfiguration.component';

describe('CPDConfigurationComponent', () => {
  let component: CPDConfigurationComponent;
  let fixture: ComponentFixture<CPDConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPDConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CPDConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
