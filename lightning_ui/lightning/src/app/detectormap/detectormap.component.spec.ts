import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectormapComponent } from './detectormap.component';

describe('DetectormapComponent', () => {
  let component: DetectormapComponent;
  let fixture: ComponentFixture<DetectormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
