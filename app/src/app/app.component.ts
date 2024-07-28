import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { Observable, SubscriptionLike, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FilterComponent, LogFilter } from './filter/filter.component';
import { ConsumersData } from '../api/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  consumers$: Observable<MessageEvent<ConsumersData>>;

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

  getOrigins(data: ConsumersData) {
    return data.status.map((status) => status.name);
  }

  ngOnDestroy() {
    this.appService.close();
  }
}
