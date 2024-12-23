import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectrequestsnaComponent } from './rejectrequestsna.component';

describe('RejectrequestsnaComponent', () => {
  let component: RejectrequestsnaComponent;
  let fixture: ComponentFixture<RejectrequestsnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectrequestsnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectrequestsnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
