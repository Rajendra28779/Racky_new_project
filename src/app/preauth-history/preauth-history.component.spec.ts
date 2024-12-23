import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreauthHistoryComponent } from './preauth-history.component';

describe('PreauthHistoryComponent', () => {
  let component: PreauthHistoryComponent;
  let fixture: ComponentFixture<PreauthHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreauthHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreauthHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
