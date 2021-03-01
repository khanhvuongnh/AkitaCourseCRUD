import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  subscription: Subscription = new Subscription();
  courses: Course[];

  constructor(
    private courseService: CourseService,
    private courseQuery: CourseQuery,
    private spinnerService: NgxSpinnerService,
    private alertUtitlyService: AlertUtilityService
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.courseQuery.selectLoading().subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide())
    );

    this.subscription.add(
      this.courseQuery.selectAll().subscribe(courses => this.courses = courses)
    );

    this.getCourses();
  }

  getCourses() {
    timer(1000).pipe(switchMap(() => this.courseService.getAllCourses())).subscribe();
  }

  deleteCourse(courseId: string) {
    this.alertUtitlyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.subscription.add(
        this.courseService.deleteCourse(courseId).subscribe(() => {
          this.alertUtitlyService.success('Course was successfully deleted.', 'Success!');
        }, error => {
          this.alertUtitlyService.error('Deleting course failed on save.', 'Error');
          console.log(error);
        })
      );
    });
  }

  showUpdateForm(course: Course) {
    this.courseToBeUpdated = { ...course };
    this.isUpdateActivated = true;
  }

  updateCourse(updateForm: any) {
    this.subscription.add(
      this.courseService.updateCourse(updateForm.value).subscribe(() => {
        this.alertUtitlyService.success('Course was successfully updated.', 'Success!');
      }, error => {
        this.alertUtitlyService.error('Updating course failed on save.', 'Error');
        console.log(error);
      })
    );
    this.isUpdateActivated = false;
    this.courseToBeUpdated = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
