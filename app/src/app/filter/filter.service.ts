import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { xor, intersection } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private formBuilder: FormBuilder) {}

  getOriginDiff(oldOrigins: string[], newOrigins: string[]) {
    const xorOldNew = xor(oldOrigins, newOrigins);
    const removed = intersection(oldOrigins, xorOldNew);
    const added = intersection(newOrigins, xorOldNew);

    return { removed, added };
  }

  buildForm(levels: string[], origins: string[]) {
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

  getKeysWithTrue(obj: Record<string, boolean | null | undefined>) {
    return Object.entries(obj)
      .filter(([key, value]) => value)
      .map(([level]) => level);
  }
}
