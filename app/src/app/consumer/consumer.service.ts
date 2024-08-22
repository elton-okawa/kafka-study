import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
  constructor(private readonly http: HttpClient) {}

  stop(name: string) {
    return this.http.put(`/consumers/${name}/active`, { active: false });
  }

  simulateError(name: string, simulateError: boolean) {
    return this.http.put(`/consumers/${name}/simulate-error`, {
      simulateError,
    });
  }

  add() {
    return this.http.post('/consumers', {});
  }

  stopAll() {
    return this.http.put('/consumers', { active: false });
  }

  clearAll() {
    return this.http.delete('/consumers');
  }
}
