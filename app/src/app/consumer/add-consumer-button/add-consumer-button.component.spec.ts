import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumerButtonComponent } from './add-consumer-button.component';

describe('AddConsumerButtonComponent', () => {
  let component: AddConsumerButtonComponent;
  let fixture: ComponentFixture<AddConsumerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsumerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConsumerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
