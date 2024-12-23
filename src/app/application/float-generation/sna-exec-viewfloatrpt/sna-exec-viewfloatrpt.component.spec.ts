import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaExecViewfloatrptComponent } from './sna-exec-viewfloatrpt.component';

describe('SnaExecViewfloatrptComponent', () => {
  let component: SnaExecViewfloatrptComponent;
  let fixture: ComponentFixture<SnaExecViewfloatrptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaExecViewfloatrptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaExecViewfloatrptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
