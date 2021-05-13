import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { CoursesStore } from 'src/app/_core/stores/course.store';

@UntilDestroy()
@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnInit {
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
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide());

    // Get active entity
    let course = this.coursesQuery.getActive();

    // Check if entity has value
    course ? this.form.patchValue(course) : this.router.navigate(['/course']);
  }

  initForm() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required]
    });
  }

  onSubmit(course: Course) {
    this.coursesStore.setLoading(true);
    this.courseService
      .update(course)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res.success) {
          this.snotifyService.success(res.caption, 'Success');
          this.router.navigateByUrl('/course');
        } else {
          this.snotifyService.error(res.caption, 'Error');
        }
      }, error => console.error(error), () => this.coursesStore.setLoading(false));
  }
}
