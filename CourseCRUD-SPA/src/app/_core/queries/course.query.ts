import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CoursesState, CoursesStore } from '../stores/course.store';

@Injectable({ providedIn: 'root' })
export class CoursesQuery extends QueryEntity<CoursesState> {
  constructor(protected store: CoursesStore) {
    super(store);
  }
}
