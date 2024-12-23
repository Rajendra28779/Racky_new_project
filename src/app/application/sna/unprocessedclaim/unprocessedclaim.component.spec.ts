import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedclaimComponent } from './unprocessedclaim.component';

describe('UnprocessedclaimComponent', () => {
  let component: UnprocessedclaimComponent;
  let fixture: ComponentFixture<UnprocessedclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnprocessedclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
