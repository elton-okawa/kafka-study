import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { Observable, SubscriptionLike, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FilterComponent, LogFilter } from './filter/filter.component';

export enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
}

export type Log = {
  level: LogLevel;
  timestamp: string;
  message: string;
  origin: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  consumers$: Observable<MessageEvent<Log[]>>;

  constructor(private appService: AppService) {
    const url = 'http://localhost:3000/listen';
    const eventNames = ['consumers'];

    this.consumers$ = this.appService
      .connectToServerSentEvents<string>(url, {}, eventNames)
      .pipe(map((event) => ({ ...event, data: JSON.parse(event.data) })));
  }

  onFilterChanged(filter: LogFilter) {
    console.log(filter);
  }

  getOrigins(data: Log[]) {
    const set = new Set<string>();
    data.map((log) => set.add(log.origin));
    return Array.from(set.values());
  }

  ngOnDestroy() {
    this.appService.close();
  }
}
