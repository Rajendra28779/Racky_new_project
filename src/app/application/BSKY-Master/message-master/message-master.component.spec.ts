import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMasterComponent } from './message-master.component';

describe('MessageMasterComponent', () => {
  let component: MessageMasterComponent;
  let fixture: ComponentFixture<MessageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
