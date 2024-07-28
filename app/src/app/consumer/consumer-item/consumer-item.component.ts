import { Component, Input } from '@angular/core';
import { ConsumerStatus } from '../../../api/models';
import { ConsumerService } from '../consumer.service';

@Component({
  selector: 'app-consumer-item',
  standalone: true,
  imports: [],
  templateUrl: './consumer-item.component.html',
  styleUrl: './consumer-item.component.scss',
})
export class ConsumerItemComponent {
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
