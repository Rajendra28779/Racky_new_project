import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerytypeviewComponent } from './querytypeview.component';

describe('QuerytypeviewComponent', () => {
  let component: QuerytypeviewComponent;
  let fixture: ComponentFixture<QuerytypeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuerytypeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerytypeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
