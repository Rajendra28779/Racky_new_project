import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedactionComponent } from './unprocessedaction.component';

describe('UnprocessedactionComponent', () => {
  let component: UnprocessedactionComponent;
  let fixture: ComponentFixture<UnprocessedactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnprocessedactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
