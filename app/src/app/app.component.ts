import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { Observable, SubscriptionLike } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  consumers$: Observable<MessageEvent<string>>;

  constructor(private appService: AppService) {
    const url = 'http://localhost:3000/listen';
    const eventNames = ['consumers'];

    this.consumers$ = this.appService.connectToServerSentEvents<string>(
      url,
      {},
      eventNames
    );
  }

  parseLogs(data: string): Log[] {
    return JSON.parse(data);
  }

  ngOnDestroy() {
    this.appService.close();
  }
}
