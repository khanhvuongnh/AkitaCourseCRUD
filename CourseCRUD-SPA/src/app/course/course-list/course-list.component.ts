import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CourseQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { CourseStore } from 'src/app/_core/stores/course.store';

@Component({
  selector: 'app-courses-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit, OnDestroy {
  courseToBeUpdated: Course;
  isUpdateActivated = false;
  courses: Course[];
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private courseService: CourseService,
    private courseQuery: CourseQuery,
    private spinnerService: NgxSpinnerService,
    private snotifyService: CustomNgSnotifyService,
    private courseStore: CourseStore,
    private router: Router
  ) { }

  ngOnInit() {
    // Delay 1s before load data
    timer(1000).pipe(switchMap(() => this.courseService.getAllCourses())).subscribe();

    // Create a 'isLoading' subscription
    this.courseQuery
      .selectLoading()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide());

    // Create a 'entities' subscription
    this.courseQuery
      .selectAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(courses => this.courses = courses);
  }

  deleteCourse(courseId: string) {
    this.snotifyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.courseService
        .deleteCourse(courseId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.snotifyService.success('Course was successfully deleted.', 'Success!')
        }, error => {
          this.snotifyService.error('Deleting course failed on save.', 'Error');
          console.log(error);
        });
    });
  }

  goToUpdate(id: string) {
    // Set active to an entity by id
    this.courseStore.setActive(id);

    // Navigate to update page
    this.router.navigate(['/update']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
