import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerItemComponent } from './consumer-item.component';

describe('ConsumerItemComponent', () => {
  let component: ConsumerItemComponent;
  let fixture: ComponentFixture<ConsumerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
