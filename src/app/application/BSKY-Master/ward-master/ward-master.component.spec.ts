import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardMasterComponent } from './ward-master.component';

describe('WardMasterComponent', () => {
  let component: WardMasterComponent;
  let fixture: ComponentFixture<WardMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
