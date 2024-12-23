import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsuCpdMappingComponent } from './tsu-cpd-mapping.component';

describe('TsuCpdMappingComponent', () => {
  let component: TsuCpdMappingComponent;
  let fixture: ComponentFixture<TsuCpdMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsuCpdMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsuCpdMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
