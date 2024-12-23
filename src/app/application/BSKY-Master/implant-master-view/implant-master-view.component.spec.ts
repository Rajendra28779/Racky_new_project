import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplantMasterViewComponent } from './implant-master-view.component';

describe('ImplantMasterViewComponent', () => {
  let component: ImplantMasterViewComponent;
  let fixture: ComponentFixture<ImplantMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImplantMasterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplantMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
