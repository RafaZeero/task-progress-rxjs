import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMistakesComponent } from './common-mistakes.component';

describe('CommonMistakesComponent', () => {
  let component: CommonMistakesComponent;
  let fixture: ComponentFixture<CommonMistakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonMistakesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonMistakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
