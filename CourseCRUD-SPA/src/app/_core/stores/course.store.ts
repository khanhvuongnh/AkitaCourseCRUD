import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Course } from '../models/course.model';
import { KeyValuePair } from '../utilities/key-value-pair';
import { Pagination } from '../utilities/pagination';

export interface CoursesState extends EntityState<Course, string> {
  pagination: Pagination,
  categories: KeyValuePair[]
}

export function createInitialState(): CoursesState {
  return {
    pagination: <Pagination>{
      currentPage: 1,
      pageSize: 10
    },
    categories: []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'courses' })
export class CoursesStore extends EntityStore<CoursesState> {
  constructor() {
    super(createInitialState());
  }
}
