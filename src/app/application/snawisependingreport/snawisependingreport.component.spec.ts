import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnawisependingreportComponent } from './snawisependingreport.component';

describe('SnawisependingreportComponent', () => {
  let component: SnawisependingreportComponent;
  let fixture: ComponentFixture<SnawisependingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnawisependingreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnawisependingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
