import {
  Component,
  DestroyRef,
  inject,
  input,
  Input,
  signal,
} from '@angular/core';
import { ConsumerStatus } from '../../../api/models';
import { ConsumerService } from '../consumer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tr[appConsumerItem]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './consumer-item.component.html',
  styleUrl: './consumer-item.component.scss',
})
export class ConsumerItemComponent {
  consumerStatus = input.required<ConsumerStatus>();
  loading = signal(false);

  private service = inject(ConsumerService);
  private destroyRef = inject(DestroyRef);

  onStop() {
    this.loading.set(true);
    const subscription = this.service
      .stop(this.consumerStatus().name)
      .subscribe(() => {
        this.loading.set(false);
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onToggleSimulatedError(event: Event) {
    const simulateError = (event.target as HTMLInputElement).checked;

    const subscription = this.service
      .simulateError(this.consumerStatus().name, simulateError)
      .subscribe({
        complete: () => {
          this.loading.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
