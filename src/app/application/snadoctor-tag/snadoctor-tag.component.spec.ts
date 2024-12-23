import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnadoctorTagComponent } from './snadoctor-tag.component';

describe('SnadoctorTagComponent', () => {
  let component: SnadoctorTagComponent;
  let fixture: ComponentFixture<SnadoctorTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnadoctorTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnadoctorTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
