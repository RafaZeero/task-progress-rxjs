import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HocMapsComponent } from './hoc-maps.component';

describe('HocMapsComponent', () => {
  let component: HocMapsComponent;
  let fixture: ComponentFixture<HocMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HocMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HocMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
