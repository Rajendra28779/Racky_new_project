import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospempanelmentdownlordpdfComponent } from './hospempanelmentdownlordpdf.component';

describe('HospempanelmentdownlordpdfComponent', () => {
  let component: HospempanelmentdownlordpdfComponent;
  let fixture: ComponentFixture<HospempanelmentdownlordpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospempanelmentdownlordpdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospempanelmentdownlordpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
