import { Component, Input } from '@angular/core';
import { ConsumerStatus } from '../../api/models';
import { ConsumerService } from './consumer.service';
import { ConsumerItemComponent } from './consumer-item/consumer-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consumer',
  standalone: true,
  imports: [CommonModule, ConsumerItemComponent],
  templateUrl: './consumer.component.html',
  styleUrl: './consumer.component.scss',
})
export class ConsumerComponent {
  @Input() consumers!: ConsumerStatus[];

  constructor(private service: ConsumerService) {}

  startConsumer() {
    this.service.add().subscribe();
  }

  stopAllConsumers() {
    this.service.stopAll().subscribe();
  }

  clearAllData() {
    this.service.clearAll().subscribe();
  }
}
