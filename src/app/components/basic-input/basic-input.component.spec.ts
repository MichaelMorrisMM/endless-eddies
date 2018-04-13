import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInputComponentComponent } from './basic-input-component.component';

describe('BasicInputComponentComponent', () => {
  let component: BasicInputComponentComponent;
  let fixture: ComponentFixture<BasicInputComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInputComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
