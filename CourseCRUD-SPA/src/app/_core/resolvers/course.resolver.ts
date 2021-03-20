import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Course } from "../models/course.model";
import { CourseService } from "../services/course.service";

@Injectable({ providedIn: 'root' })
export class CourseResolver implements Resolve<Course> {
  constructor(private courseService: CourseService) { }

  resolve(): Observable<any> | Promise<any> | any {
    return this.courseService.getAllCourses();
  }
}