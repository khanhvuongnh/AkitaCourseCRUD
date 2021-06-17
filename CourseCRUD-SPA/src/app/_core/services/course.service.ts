import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { CoursesStore } from '../stores/course.store';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination, PaginationResult } from '../utilities/pagination';
import { OperationResult } from '../utilities/operation-result';
import { MinMaxPrice } from '../utilities/min-max-price';
import { FilterParam } from '../utilities/filter-param';
import { SearchParam, SortParam } from '../utilities/search-param';

@Injectable({ providedIn: 'root' })
export class CourseService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private coursesStore: CoursesStore) { }

  getAll(pagination: Pagination, sortParam: SortParam, filterParam: FilterParam) {
    let params = new HttpParams()
      .set('pageNumber', pagination.currentPage.toString())
      .set('pageSize', pagination.pageSize.toString());

    let search: SearchParam = { filterParam, sortParam }

    return this.http.post<PaginationResult<Course>>(`${this.apiUrl}/Course/GetAll`, search, { params }).pipe(
      tap(res => {
        this.coursesStore.set(res.result);
        this.coursesStore.update({ pagination: res.pagination });
      })
    );
  }

  create(course: Course) {
    return this.http.post<OperationResult>(`${this.apiUrl}/Course`, course);
  }

  delete(id: string) {
    return this.http.delete<OperationResult>(`${this.apiUrl}/Course/${id}`);
  }

  update(course: Course) {
    return this.http.put<OperationResult>(`${this.apiUrl}/Course`, course);
  }

  getMinMaxPrice() {
    return this.http.get<MinMaxPrice>(`${this.apiUrl}/Course/MinMaxPrice`);
  }
}
