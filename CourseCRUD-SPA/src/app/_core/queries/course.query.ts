import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CourseState, CourseStore } from '../stores/course.store';

@Injectable({ providedIn: 'root' })
export class CourseQuery extends QueryEntity<CourseState> {
  constructor(protected store: CourseStore) {
    super(store);
  }

  selectAreCoursesLoaded$ = this.select(state => {
    return state.areCoursesLoaded;
  });
}
