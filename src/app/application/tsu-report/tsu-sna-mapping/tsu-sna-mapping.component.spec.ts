import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuSnaMappingComponent } from './tsu-sna-mapping.component';

describe('TsuSnaMappingComponent', () => {
  let component: TsuSnaMappingComponent;
  let fixture: ComponentFixture<TsuSnaMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuSnaMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuSnaMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
