import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedforAdminComponent } from './unprocessedfor-admin.component';

describe('UnprocessedforAdminComponent', () => {
  let component: UnprocessedforAdminComponent;
  let fixture: ComponentFixture<UnprocessedforAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnprocessedforAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedforAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
