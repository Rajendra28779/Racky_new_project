import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDMOConfigurationComponent } from './cdmoconfiguration.component';

describe('CDMOConfigurationComponent', () => {
  let component: CDMOConfigurationComponent;
  let fixture: ComponentFixture<CDMOConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDMOConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CDMOConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
