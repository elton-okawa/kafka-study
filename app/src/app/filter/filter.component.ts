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
    const { removed, added } = this.filterService.getOriginDiff(
      this._origins,
      newOrigins
    );

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

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filters = this.filterService.buildForm(
      this.availableLevels,
      this._origins
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
}
