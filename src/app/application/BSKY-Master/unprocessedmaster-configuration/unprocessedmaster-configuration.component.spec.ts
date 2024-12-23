import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedmasterConfigurationComponent } from './unprocessedmaster-configuration.component';

describe('UnprocessedmasterConfigurationComponent', () => {
  let component: UnprocessedmasterConfigurationComponent;
  let fixture: ComponentFixture<UnprocessedmasterConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnprocessedmasterConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedmasterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
