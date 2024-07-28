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
  ReactiveFormsModule,
} from '@angular/forms';

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
  @Input() origins: string[] = [];
  @Output() filterEvent = new EventEmitter<LogFilter>();
  availableLevels = ['info', 'error', 'warn'];

  filters!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.filters = this.formBuilder.group({
      levels: this.formBuilder.group(
        this.availableLevels.reduce((map, level) => {
          map[level] = [false];
          return map;
        }, {} as Record<string, boolean[]>)
      ),
      origins: this.formBuilder.group(
        this.origins.reduce((map, origin) => {
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
