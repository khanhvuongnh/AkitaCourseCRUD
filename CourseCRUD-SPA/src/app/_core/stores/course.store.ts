import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Course } from '../models/course.model';

export interface CourseState extends EntityState<Course, string> {
  areCoursesLoaded: boolean;
}

export function createInitialState(): CourseState {
  return {
    areCoursesLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'courses' })
export class CourseStore extends EntityStore<CourseState> {
  constructor() {
    super(createInitialState());
  }

  loadCourses(courses: Course[], areCoursesLoaded: boolean) {
    this.set(courses);
    this.update(state => ({
      ...state,
      areCoursesLoaded
    }));
  }
}
