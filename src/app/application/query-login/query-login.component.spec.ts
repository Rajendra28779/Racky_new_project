import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLoginComponent } from './query-login.component';

describe('QueryLoginComponent', () => {
  let component: QueryLoginComponent;
  let fixture: ComponentFixture<QueryLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
