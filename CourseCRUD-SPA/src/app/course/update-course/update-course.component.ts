import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { CoursesStore } from 'src/app/_core/stores/course.store';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnInit {
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

    // Get active entity
    let course = this.coursesQuery.getActive();

    // Check if entity has value
    course ? this.form.patchValue(course) : this.router.navigate(['/course']);
  }

  initForm() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(course: Course) {
    this.coursesStore.setLoading(true);
    this.courseService
      .update(course)
      .pipe(
        delay(500),
        takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res) {
          this.snotifyService.success('Course was successfully updated.', 'Success!');
          this.router.navigateByUrl('/course');
        } else {
          this.snotifyService.error('Updating course failed on save.', 'Error!');
        }
      }, error => console.error(error), () => this.coursesStore.setLoading(false));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
