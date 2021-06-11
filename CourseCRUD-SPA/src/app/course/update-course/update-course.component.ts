import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CategoryService } from 'src/app/_core/services/category.service';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import * as courseStore from 'src/app/_core/stores/course.store';
import { KeyValuePair } from 'src/app/_core/utilities/key-value-pair';

@UntilDestroy()
@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnInit {
  form: FormGroup;
  categories: KeyValuePair[] = [];

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router,
    private snotifyService: CustomNgSnotifyService,
    private fb: FormBuilder,
    private coursesQuery: CoursesQuery,
    private spinnerService: NgxSpinnerService
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Get categories
    this.coursesQuery
      .select(state => state.categories)
      .pipe(untilDestroyed(this))
      .subscribe(categories => this.categories = categories);

    this.getCategories();

    // Get active entity
    let course = this.coursesQuery.getActive();

    // Check if entity has value
    course ? this.form.patchValue(course) : this.router.navigate(['/course']);
  }

  initForm() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required],
      category_ID: [0],
      price: [0]
    });
  }

  getCategories() {
    this.categoryService
      .getKVCategories()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  onSubmit(course: Course) {
    this.spinnerService.show();
    this.courseService
      .update(course)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.snotifyService.success(res.caption, 'Success');
          this.router.navigateByUrl('/course');
        } else {
          this.snotifyService.error(res.caption, 'Error');
        }
      }, error => {
        console.log(error);
        this.spinnerService.hide();
      });
  }
}
