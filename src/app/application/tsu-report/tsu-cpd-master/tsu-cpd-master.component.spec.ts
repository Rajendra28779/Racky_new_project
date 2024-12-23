import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuCpdMasterComponent } from './tsu-cpd-master.component';

describe('TsuCpdMasterComponent', () => {
  let component: TsuCpdMasterComponent;
  let fixture: ComponentFixture<TsuCpdMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuCpdMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuCpdMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
