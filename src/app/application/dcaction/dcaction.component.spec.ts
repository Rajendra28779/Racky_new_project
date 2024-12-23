import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcactionComponent } from './dcaction.component';

describe('DcactionComponent', () => {
  let component: DcactionComponent;
  let fixture: ComponentFixture<DcactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
