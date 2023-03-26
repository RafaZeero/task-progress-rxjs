import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DblClickComponent } from './dbl-click.component';

describe('DblClickComponent', () => {
  let component: DblClickComponent;
  let fixture: ComponentFixture<DblClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DblClickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DblClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
