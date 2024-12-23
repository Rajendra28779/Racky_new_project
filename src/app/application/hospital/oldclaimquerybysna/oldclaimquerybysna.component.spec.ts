import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldclaimquerybysnaComponent } from './oldclaimquerybysna.component';

describe('OldclaimquerybysnaComponent', () => {
  let component: OldclaimquerybysnaComponent;
  let fixture: ComponentFixture<OldclaimquerybysnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldclaimquerybysnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldclaimquerybysnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
