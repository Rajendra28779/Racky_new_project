import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPolicyUpdateComponent } from './card-policy-update.component';

describe('CardPolicyUpdateComponent', () => {
  let component: CardPolicyUpdateComponent;
  let fixture: ComponentFixture<CardPolicyUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPolicyUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPolicyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
