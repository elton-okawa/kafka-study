import { Component } from '@angular/core';
import { ConsumerService } from '../consumer.service';

@Component({
  selector: 'app-add-consumer-button',
  standalone: true,
  imports: [],
  templateUrl: './add-consumer-button.component.html',
  styleUrl: './add-consumer-button.component.scss',
})
export class AddConsumerButtonComponent {
  loading = false;

  constructor(private service: ConsumerService) {}

  onAdd() {
    this.loading = true;
    return this.service.add().subscribe(() => {
      this.loading = false;
    });
  }
}
