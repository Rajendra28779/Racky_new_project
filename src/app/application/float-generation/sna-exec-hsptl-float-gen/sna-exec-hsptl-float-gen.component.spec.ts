import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaExecHsptlFloatGenComponent } from './sna-exec-hsptl-float-gen.component';

describe('SnaExecHsptlFloatGenComponent', () => {
  let component: SnaExecHsptlFloatGenComponent;
  let fixture: ComponentFixture<SnaExecHsptlFloatGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaExecHsptlFloatGenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaExecHsptlFloatGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
