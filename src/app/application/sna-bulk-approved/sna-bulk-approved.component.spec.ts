import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaBulkApprovedComponent } from './sna-bulk-approved.component';

describe('SnaBulkApprovedComponent', () => {
  let component: SnaBulkApprovedComponent;
  let fixture: ComponentFixture<SnaBulkApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnaBulkApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaBulkApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
