import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { Course } from 'src/app/_core/models/course.model';
import { CourseService } from 'src/app/_core/services/course.service';
import { takeUntil } from 'rxjs/operators';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.form = this.fb.group({
      id: [uuid.v4(), Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(course: Course) {
    this.courseService
      .createCourse(course)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.snotifyService.success('Course was successfully created.', 'Success!');
        this.router.navigateByUrl('/course');
      }, error => {
        this.snotifyService.error('Creating course failed on save.', 'Error!');
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
