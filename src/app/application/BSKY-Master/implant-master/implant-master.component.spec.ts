import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplantMasterComponent } from './implant-master.component';

describe('ImplantMasterComponent', () => {
  let component: ImplantMasterComponent;
  let fixture: ComponentFixture<ImplantMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImplantMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplantMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
