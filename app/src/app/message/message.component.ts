import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from './message.service';
import { Message } from '../../api/models';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  form!: FormGroup<{
    key: FormControl<string | null>;
    value: FormControl<string | null>;
  }>;

  constructor(
    private formBuilder: FormBuilder,
    private service: MessageService
  ) {}

  onSubmit() {
    this.service.send(this.form.value as Message).subscribe();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      key: [''],
      value: ['test value'],
    });
  }
}
