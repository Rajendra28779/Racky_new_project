import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysrejectedreportsComponent } from './sysrejectedreports.component';

describe('SysrejectedreportsComponent', () => {
  let component: SysrejectedreportsComponent;
  let fixture: ComponentFixture<SysrejectedreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysrejectedreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysrejectedreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
