import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcpdComponent } from './viewcpd.component';

describe('ViewcpdComponent', () => {
  let component: ViewcpdComponent;
  let fixture: ComponentFixture<ViewcpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcpdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
