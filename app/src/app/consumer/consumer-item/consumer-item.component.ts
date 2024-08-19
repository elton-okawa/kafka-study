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

@Component({
  selector: 'app-consumer-item',
  standalone: true,
  imports: [],
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
    const subscription = this.service
      .simulateError(
        this.consumerStatus().name,
        (event.target as HTMLInputElement).checked
      )
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
