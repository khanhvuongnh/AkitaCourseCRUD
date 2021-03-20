import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CourseQuery } from 'src/app/_core/queries/course.query';
import { AlertUtilityService } from 'src/app/_core/services/alert-utility.service';
import { CourseService } from 'src/app/_core/services/course.service';

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
    private alertUtitlyService: AlertUtilityService
  ) { }

  ngOnInit() {
    this.courseQuery
      .selectLoading()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide());

    this.courseQuery
      .selectAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(courses => this.courses = courses);
  }

  deleteCourse(courseId: string) {
    this.alertUtitlyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.courseService
        .deleteCourse(courseId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.alertUtitlyService.success('Course was successfully deleted.', 'Success!')
        }, error => {
          this.alertUtitlyService.error('Deleting course failed on save.', 'Error');
          console.log(error);
        });
    });
  }

  showUpdateForm(course: Course) {
    this.courseToBeUpdated = { ...course };
    this.isUpdateActivated = true;
  }

  updateCourse(updateForm: any) {
    this.courseService
      .updateCourse(updateForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.alertUtitlyService.success('Course was successfully updated.', 'Success!');
      }, error => {
        this.alertUtitlyService.error('Updating course failed on save.', 'Error');
        console.log(error);
      });
    this.isUpdateActivated = false;
    this.courseToBeUpdated = null;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
