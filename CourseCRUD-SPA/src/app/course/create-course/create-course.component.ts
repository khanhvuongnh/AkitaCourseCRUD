import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { Course } from 'src/app/_core/models/course.model';
import { CourseService } from 'src/app/_core/services/course.service';
import { delay, takeUntil } from 'rxjs/operators';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesStore } from 'src/app/_core/stores/course.store';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html'
})
export class CreateCourseComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  form: FormGroup;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private snotifyService: CustomNgSnotifyService,
    private fb: FormBuilder,
    private coursesStore: CoursesStore,
    private coursesQuery: CoursesQuery,
    private spinnerService: NgxSpinnerService
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Create a 'isLoading' subscription
    this.coursesQuery
      .selectLoading()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide());
  }

  initForm() {
    this.form = this.fb.group({
      id: [uuid.v4(), Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(course: Course) {
    this.coursesStore.setLoading(true);
    this.courseService
      .create(course)
      .pipe(
        delay(500),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(res => {
        if (res) {
          this.snotifyService.success('Course was successfully created.', 'Success!');
          this.router.navigateByUrl('/course');
        } else {
          this.snotifyService.error('Creating course failed on save.', 'Error!');
        }
      }, error => console.error(error), () => this.coursesStore.setLoading(false));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
