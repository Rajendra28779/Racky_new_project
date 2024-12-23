import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertedApplicationComponent } from './reverted-application.component';

describe('RevertedApplicationComponent', () => {
  let component: RevertedApplicationComponent;
  let fixture: ComponentFixture<RevertedApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertedApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevertedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
