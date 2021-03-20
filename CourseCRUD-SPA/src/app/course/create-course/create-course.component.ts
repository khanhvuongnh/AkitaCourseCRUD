import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { Course } from 'src/app/_core/models/course.model';
import { CourseService } from 'src/app/_core/services/course.service';
import { AlertUtilityService } from 'src/app/_core/services/alert-utility.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html'
})
export class CreateCourseComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private courseService: CourseService,
    private router: Router,
    private alertUtilityService: AlertUtilityService
  ) { }

  ngOnInit() {
  }

  onSubmit(submittedForm: any) {
    const course: Course = { id: uuid.v4(), name: submittedForm.value.name, description: submittedForm.value.description };
    this.courseService
      .createCourse(course)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.alertUtilityService.success('Course was successfully created.', 'Success!');
        this.router.navigateByUrl('/course');
      }, error => {
        this.alertUtilityService.error('Creating course failed on save.', 'Error!');
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
