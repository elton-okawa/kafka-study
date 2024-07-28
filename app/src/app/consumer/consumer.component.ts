import { Component, Input } from '@angular/core';
import { ConsumerStatus } from '../../api/models';
import { ConsumerService } from './consumer.service';
import { AddConsumerButtonComponent } from './add-consumer-button/add-consumer-button.component';
import { ConsumerItemComponent } from './consumer-item/consumer-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consumer',
  standalone: true,
  imports: [CommonModule, AddConsumerButtonComponent, ConsumerItemComponent],
  templateUrl: './consumer.component.html',
  styleUrl: './consumer.component.scss',
})
export class ConsumerComponent {
  @Input() consumers!: ConsumerStatus[];
}
