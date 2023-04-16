import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HocObservablesComponent } from './hoc-observables.component';

describe('HocObservablesComponent', () => {
  let component: HocObservablesComponent;
  let fixture: ComponentFixture<HocObservablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HocObservablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HocObservablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
