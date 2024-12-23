import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPaymentListComponent } from './post-payment-list.component';

describe('PostPaymentListComponent', () => {
  let component: PostPaymentListComponent;
  let fixture: ComponentFixture<PostPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
