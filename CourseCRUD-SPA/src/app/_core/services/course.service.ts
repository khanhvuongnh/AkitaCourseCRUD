import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { CoursesStore } from '../stores/course.store';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination, PaginationResult } from '../utilities/pagination';

@Injectable({ providedIn: 'root' })
export class CourseService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private coursesStore: CoursesStore
  ) { }

  getAll(pagination: Pagination) {
    let params = new HttpParams()
      .set('pageNumber', pagination.currentPage.toString())
      .set('pageSize', pagination.pageSize.toString());

    return this.http.get<PaginationResult<Course>>(`${this.apiUrl}/Course`, { params }).pipe(
      tap(res => {
        this.coursesStore.set(res.result);
        this.coursesStore.update({ pagination: res.pagination });
      })
    );
  }

  create(course: Course) {
    return this.http.post<boolean>(`${this.apiUrl}/Course`, course);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/Course/${id}`);
  }

  update(course: Course) {
    return this.http.put<boolean>(`${this.apiUrl}/Course/${course.id}`, course);
  }
}
