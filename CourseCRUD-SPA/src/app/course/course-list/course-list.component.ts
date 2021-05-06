import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, timer } from 'rxjs';
import { delay, switchMap, takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { CoursesStore } from 'src/app/_core/stores/course.store';
import { Pagination } from 'src/app/_core/utilities/pagination';

@Component({
  selector: 'app-courses-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit, OnDestroy {
  courseToBeUpdated: Course;
  isUpdateActivated = false;
  courses: Course[];
  pagination: Pagination;
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private courseService: CourseService,
    private coursesQuery: CoursesQuery,
    private spinnerService: NgxSpinnerService,
    private snotifyService: CustomNgSnotifyService,
    private coursesStore: CoursesStore,
    private router: Router
  ) { }

  ngOnInit() {
    // Create a 'isLoading' subscription
    this.coursesQuery
      .selectLoading()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => isLoading ? this.spinnerService.show() : this.spinnerService.hide());

    // Create a 'entities' subscription
    this.coursesQuery
      .selectAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(courses => this.courses = courses);

    // Create a 'pagination' subscription
    this.coursesQuery
      .select(state => state.pagination)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(pagination => this.pagination = pagination);

    // Delay 1s before load data
    if (!this.coursesQuery.hasEntity()) {
      timer(1000)
        .pipe(
          switchMap(() => this.courseService.getAll(this.pagination)),
          takeUntil(this.unsubscribe$))
        .subscribe();
    } else {
      let pagination = { ...this.pagination };
      pagination.currentPage = 1;
      this.coursesStore.update({ pagination });
      this.loadData();
    }
  }

  loadData() {
    let pagination = { ...this.pagination };
    this.courseService
      .getAll(this.pagination)
      .pipe(
        switchMap(res => {
          if (res.pagination.currentPage > res.pagination.totalPage) {
            pagination.currentPage = res.pagination.totalPage
          }
          return this.courseService.getAll(pagination)
        }),
        takeUntil(this.unsubscribe$))
      .subscribe();
  }

  deleteCourse(id: string) {
    this.snotifyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.coursesStore.setLoading(true);
      this.courseService
        .delete(id)
        .pipe(
          delay(500),
          takeUntil(this.unsubscribe$))
        .subscribe(res => {
          if (res) {
            this.snotifyService.success('Course was successfully deleted.', 'Success!');
            this.loadData();
          } else {
            this.snotifyService.error('Deleting course failed on save.', 'Error');
          }
        }, error => console.error(error), () => this.coursesStore.setLoading(false));
    });
  }

  goToUpdate(id: string) {
    // Set active to an entity by id
    this.coursesStore.setActive(id);

    // Navigate to update page
    this.router.navigate(['/update']);
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
