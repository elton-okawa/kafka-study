import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../api/models';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  send(data: Message) {
    const payload = { ...data };
    if (!payload.key) {
      delete payload.key;
    }

    return this.http.post('/messages', payload);
  }
}
