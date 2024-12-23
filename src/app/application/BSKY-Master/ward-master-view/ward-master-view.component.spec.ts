import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardMasterViewComponent } from './ward-master-view.component';

describe('WardMasterViewComponent', () => {
  let component: WardMasterViewComponent;
  let fixture: ComponentFixture<WardMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardMasterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WardMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
