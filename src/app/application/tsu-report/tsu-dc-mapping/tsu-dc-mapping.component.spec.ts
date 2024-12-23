import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuDcMappingComponent } from './tsu-dc-mapping.component';

describe('TsuDcMappingComponent', () => {
  let component: TsuDcMappingComponent;
  let fixture: ComponentFixture<TsuDcMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuDcMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuDcMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
