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
  private _origins: string[] = [];

  @Input()
  set origins(newOrigins: string[]) {
    const xorOldNew = xor(this._origins, newOrigins);
    const removed = intersection(this._origins, xorOldNew);
    const added = intersection(newOrigins, xorOldNew);

    removed.forEach((origin) => {
      this.filters?.controls.origins.removeControl(origin);
    });

    added.forEach((origin) => {
      this.filters?.controls.origins.addControl(origin, new FormControl(false));
    });

    this._origins = newOrigins;
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.filters = this.buildFiltersForm(this.availableLevels, this._origins);
  }

  private buildFiltersForm(levels: string[], origins: string[]) {
    return this.formBuilder.group({
      levels: this.formBuilder.record(
        levels.reduce((map, level) => {
          map[level] = [false];
          return map;
        }, {} as Record<string, boolean[]>)
      ),
      origins: this.formBuilder.record(
        origins.reduce((map, origin) => {
          map[origin] = [false];
          return map;
        }, {} as Record<string, boolean[]>)
      ),
    });
  }

  onFilterChange() {
    this.filterEvent.emit({
      levels: this.getKeysWithTrue(this.filters.value.levels ?? {}),
      origins: this.getKeysWithTrue(this.filters.value.origins ?? {}),
    });
  }

  private getKeysWithTrue(obj: Record<string, boolean | null | undefined>) {
    return Object.entries(obj)
      .filter(([key, value]) => value)
      .map(([level]) => level);
  }
}
