import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { Course } from 'src/app/_core/models/course.model';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesStore } from 'src/app/_core/stores/course.store';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CategoryService } from 'src/app/_core/services/category.service';
import { KeyValuePair } from 'src/app/_core/utilities/key-value-pair';

@UntilDestroy()
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html'
})
export class CreateCourseComponent implements OnInit {
  form: FormGroup;
  categories: KeyValuePair[] = [];

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
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
    this.coursesQuery
      .select(state => state.categories)
      .pipe(untilDestroyed(this))
      .subscribe(categories => this.categories = categories);

    this.getCategories();
  }

  initForm() {
    this.form = this.fb.group({
      id: [uuid.v4(), Validators.required],
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
    this.coursesStore.setLoading(true);
    this.courseService
      .create(course)
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
