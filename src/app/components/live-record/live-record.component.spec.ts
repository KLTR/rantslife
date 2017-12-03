import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveRecordComponent } from './live-record.component';

describe('LiveRecordComponent', () => {
  let component: LiveRecordComponent;
  let fixture: ComponentFixture<LiveRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
