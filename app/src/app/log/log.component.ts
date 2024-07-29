import { Component, Input } from '@angular/core';
import { Log, LogLevel } from '../../api/models';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss',
})
export class LogComponent {
  @Input() log!: Log;

  get formatTimestamp() {
    return new Date(this.log.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }
}
