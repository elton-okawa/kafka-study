import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
} from '@angular/forms';
import { intersection, xor } from 'lodash';
import { FilterService } from './filter.service';
import { ConsumerStatus } from '../../api/models';

export type LogFilter = {
  levels: string[];
  origins: string[];
};

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  private _consumers: ConsumerStatus[] = [];

  @Input()
  set consumers(newConsumers: ConsumerStatus[]) {
    const { removed, added } = this.filterService.getOriginDiff(
      this._consumers.map((consumer) => consumer.name),
      newConsumers.map((consumer) => consumer.name)
    );

    removed.forEach((origin) => {
      this.filters?.controls.origins.removeControl(origin);
    });

    added.forEach((origin) => {
      this.filters?.controls.origins.addControl(origin, new FormControl(false));
    });

    this._consumers = newConsumers;
  }
  get consumers() {
    return this._consumers;
  }

  @Output() filterEvent = new EventEmitter<LogFilter>();
  availableLevels = ['info', 'error', 'warn'];

  filters!: FormGroup<{
    levels: FormRecord<FormControl<boolean | null>>;
    origins: FormRecord<FormControl<boolean | null>>;
  }>;

  get filterOrigins() {
    return Object.keys(this.filters.value.origins ?? {});
  }

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filters = this.filterService.buildForm(
      this.availableLevels,
      this._consumers.map((consumer) => consumer.name)
    );
  }

  onFilterChange() {
    this.filterEvent.emit({
      levels: this.filterService.getKeysWithTrue(
        this.filters.value.levels ?? {}
      ),
      origins: this.filterService.getKeysWithTrue(
        this.filters.value.origins ?? {}
      ),
    });
  }

  getOriginLabel(consumer: ConsumerStatus) {
    if (consumer.active) {
      return consumer.name;
    }

    return `${consumer.name} (stopped)`;
  }
}
