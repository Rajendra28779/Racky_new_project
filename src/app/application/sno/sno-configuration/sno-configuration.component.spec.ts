import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SNOConfigurationComponent } from './sno-configuration.component';

describe('SNOConfigurationComponent', () => {
  let component: SNOConfigurationComponent;
  let fixture: ComponentFixture<SNOConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SNOConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SNOConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
