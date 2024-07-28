import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
  constructor(private readonly http: HttpClient) {}

  stop(name: string) {
    return this.http.delete(`/consumers/${name}`);
  }
}
