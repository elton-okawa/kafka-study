import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { Observable, SubscriptionLike } from 'rxjs';
import { CommonModule } from '@angular/common';

type ConsumerData = {
  name: string;
  messages: string[];
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

  parseConsumerData(data: string): ConsumerData[] {
    return JSON.parse(data);
  }

  ngOnDestroy() {
    this.appService.close();
  }
}
