import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuUserMasterComponent } from './tsu-user-master.component';

describe('TsuUserMasterComponent', () => {
  let component: TsuUserMasterComponent;
  let fixture: ComponentFixture<TsuUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuUserMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
