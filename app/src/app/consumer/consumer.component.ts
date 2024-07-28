import { Component, Input } from '@angular/core';
import { ConsumerStatus } from '../../api/models';
import { ConsumerService } from './consumer.service';
import { AddConsumerButtonComponent } from './add-consumer-button/add-consumer-button.component';

@Component({
  selector: 'app-consumer',
  standalone: true,
  imports: [AddConsumerButtonComponent],
  templateUrl: './consumer.component.html',
  styleUrl: './consumer.component.scss',
})
export class ConsumerComponent {
  @Input() consumer!: ConsumerStatus;
  loading = false;

  constructor(private service: ConsumerService) {}

  onStop() {
    this.loading = true;
    return this.service.stop(this.consumer.name).subscribe(() => {
      this.loading = false;
    });
  }
}
