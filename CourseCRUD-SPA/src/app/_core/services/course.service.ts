import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { CourseStore } from '../stores/course.store';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private courseStore: CourseStore
  ) { }

  getAllCourses() {
    return this.http.get<Course[]>(`${this.apiUrl}/Course/GetAllCourses`).pipe(
      tap(courses => {
        this.courseStore.loadCourses(courses, true);
      })
    );
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/Course/CreateCourse`, course).pipe(
      tap(value => {
        this.courseStore.add(value);
      })
    );
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Course/DeleteCourse/${courseId}`).pipe(
      tap(result => {
        this.courseStore.remove(courseId);
      })
    );
  }

  updateCourse(course: Course): Observable<any> {
    return this.http.post(`${this.apiUrl}/Course/UpdateCourse`, course).pipe(
      tap(result => {
        this.courseStore.update(course.id, course);
      })
    );
  }
}
