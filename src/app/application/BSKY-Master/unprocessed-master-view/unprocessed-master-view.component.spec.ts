import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedMasterViewComponent } from './unprocessed-master-view.component';

describe('UnprocessedMasterViewComponent', () => {
  let component: UnprocessedMasterViewComponent;
  let fixture: ComponentFixture<UnprocessedMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnprocessedMasterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
