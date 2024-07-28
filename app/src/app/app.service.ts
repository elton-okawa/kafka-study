import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private eventSource: EventSource | null = null;

  constructor(private zone: NgZone) {}

  getEventSource(url: string, options: EventSourceInit): EventSource {
    return new EventSource(url, options);
  }

  connectToServerSentEvents<T>(
    url: string,
    options: EventSourceInit,
    eventNames: string[] = []
  ): Observable<MessageEvent<T>> {
    const eventSource = this.getEventSource(url, options);
    this.eventSource = eventSource;

    return new Observable<MessageEvent<T>>((subscriber) => {
      eventSource.onerror = (error) => {
        this.zone.run(() => subscriber.error(error));
      };

      eventNames.forEach((event: string) => {
        eventSource.addEventListener(event, (data: MessageEvent<T>) => {
          this.zone.run(() => subscriber.next(data));
        });
      });
    });
  }

  close(): void {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
    this.eventSource = null;
  }
}
