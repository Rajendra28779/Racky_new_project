import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidinternalComponent } from './paidinternal.component';

describe('PaidinternalComponent', () => {
  let component: PaidinternalComponent;
  let fixture: ComponentFixture<PaidinternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidinternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidinternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
