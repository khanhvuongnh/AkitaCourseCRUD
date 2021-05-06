import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Course } from '../models/course.model';
import { Pagination } from '../utilities/pagination';

export interface CoursesState extends EntityState<Course, string> {
  pagination: Pagination
}

export function createInitialState(): CoursesState {
  return {
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPage: 0
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'courses' })
export class CoursesStore extends EntityStore<CoursesState> {
  constructor() {
    super(createInitialState());
  }
}
