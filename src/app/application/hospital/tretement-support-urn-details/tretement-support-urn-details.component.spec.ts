import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TretementSupportUrnDetailsComponent } from './tretement-support-urn-details.component';

describe('TretementSupportUrnDetailsComponent', () => {
  let component: TretementSupportUrnDetailsComponent;
  let fixture: ComponentFixture<TretementSupportUrnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TretementSupportUrnDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TretementSupportUrnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
