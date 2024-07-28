import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

type LogFilter = {
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
export class FilterComponent {
  @Output() filterEvent = new EventEmitter<LogFilter>();
  availableLevels = ['info', 'error', 'warn'];

  filters = this.formBuilder.group({
    levels: this.formBuilder.group(
      this.availableLevels.reduce((map, level) => {
        map[level] = [false];
        return map;
      }, {} as Record<string, boolean[]>)
    ),
  });

  constructor(private formBuilder: FormBuilder) {}

  levelsChanged(levels: string[]) {
    console.log(levels);
  }
}
