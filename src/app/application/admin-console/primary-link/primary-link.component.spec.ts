import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryLinkComponent } from './primary-link.component';

describe('PrimaryLinkComponent', () => {
  let component: PrimaryLinkComponent;
  let fixture: ComponentFixture<PrimaryLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
