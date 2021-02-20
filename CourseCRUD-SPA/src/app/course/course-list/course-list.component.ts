import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CourseQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CourseState } from 'src/app/_core/stores/course.store';

@Component({
  selector: 'app-courses-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit, OnDestroy {
  courseToBeUpdated: Course;
  isUpdateActivated = false;
  subscriptions: Subscription = new Subscription();
  courses$: Observable<Course[]> = this.courseQuery.selectAll();

  constructor(
    private courseService: CourseService,
    private courseQuery: CourseQuery
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.courseQuery.selectAreCoursesLoaded$.pipe(
      filter(areCoursesLoaded => !areCoursesLoaded),
      switchMap(areCoursesLoaded => {
        if (!areCoursesLoaded) {
          return this.courseService.getAllCourses();
        }
      })
    ).subscribe());
  }

  deleteCourse(courseId: string) {
    this.subscriptions.add(this.courseService.deleteCourse(courseId).subscribe());
  }

  showUpdateForm(course: Course) {
    this.courseToBeUpdated = { ...course };
    this.isUpdateActivated = true;
  }

  updateCourse(updateForm: any) {
    this.subscriptions.add(this.courseService.updateCourse(updateForm.value).subscribe());
    this.isUpdateActivated = false;
    this.courseToBeUpdated = null;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
