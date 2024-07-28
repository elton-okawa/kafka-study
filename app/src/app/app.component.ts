import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { Observable, SubscriptionLike, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FilterComponent, LogFilter } from './filter/filter.component';
import { ConsumersData, Log } from '../api/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  consumers$: Observable<MessageEvent<ConsumersData>>;

  private filter: LogFilter = {
    levels: [],
    origins: [],
  };

  constructor(private appService: AppService) {
    const url = 'http://localhost:3000/listen';
    const eventNames = ['consumers'];

    this.consumers$ = this.appService
      .connectToServerSentEvents<string>(url, {}, eventNames)
      .pipe(map((event) => ({ ...event, data: JSON.parse(event.data) })));
  }

  onFilterChanged(filter: LogFilter) {
    this.filter = filter;
  }

  filterLogs(logs: Log[]) {
    return logs.filter(
      (log) =>
        (!this.filter.levels.length ||
          this.filter.levels.includes(log.level)) &&
        (!this.filter.origins.length ||
          this.filter.origins.includes(log.origin))
    );
  }

  getOrigins(data: ConsumersData) {
    return data.status.map((status) => status.name);
  }

  ngOnDestroy() {
    this.appService.close();
  }
}
