import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CourseQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';

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
    private courseQuery: CourseQuery,
    private fb: FormBuilder,
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Get active entity
    let course = this.courseQuery.getActive();

    // Check if entity has value
    course ? this.form.patchValue(course) : this.router.navigate(['/']);
  }

  initForm() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(course: Course) {
    this.courseService
      .updateCourse(course)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.snotifyService.success('Course was successfully updated.', 'Success!');
        this.router.navigateByUrl('/course');
      }, error => {
        this.snotifyService.error('Updating course failed on save.', 'Error!');
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
