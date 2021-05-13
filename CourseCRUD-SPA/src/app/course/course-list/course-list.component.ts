import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { SignalrService } from 'src/app/_core/services/signalr.service';
import { CoursesStore } from 'src/app/_core/stores/course.store';
import { Pagination } from 'src/app/_core/utilities/pagination';

@UntilDestroy()
@Component({
  selector: 'app-courses-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courseToBeUpdated: Course;
  isUpdateActivated = false;
  courses: Course[];
  pagination: Pagination;

  constructor(
    private courseService: CourseService,
    private coursesQuery: CoursesQuery,
    private spinnerService: NgxSpinnerService,
    private snotifyService: CustomNgSnotifyService,
    private coursesStore: CoursesStore,
    private router: Router,
    private signalRService: SignalrService
  ) { }

  ngOnInit() {
    // Create a 'entities' subscription
    this.coursesQuery
      .selectAll()
      .pipe(untilDestroyed(this))
      .subscribe(courses => this.courses = courses);

    // Create a 'pagination' subscription
    this.coursesQuery
      .select(state => state.pagination)
      .pipe(untilDestroyed(this))
      .subscribe(pagination => this.pagination = pagination);

    // Create a 'signalR' subscription
    this.signalRService.courseReload
      .pipe(untilDestroyed(this))
      .subscribe(isReload => { if (isReload) this.loadData() });

    // Load data
    this.loadData();
  }

  loadData() {
    let pagination = { ...this.pagination };
    this.courseService
      .getAll(this.pagination)
      .pipe(
        switchMap(res => {
          pagination.currentPage = res.pagination.currentPage > res.pagination.totalPage ? res.pagination.totalPage : res.pagination.currentPage;
          return this.courseService.getAll(pagination)
        }),
        untilDestroyed(this))
      .subscribe();
  }

  deleteCourse(id: string) {
    this.snotifyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.spinnerService.show();
      this.courseService
        .delete(id)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          if (res.success) {
            this.snotifyService.success(res.caption, 'Success');
            this.loadData();
          } else {
            this.snotifyService.error(res.caption, 'Error');
          }
        }, error => console.error(error), () => this.spinnerService.hide());
    });
  }

  goToUpdate(id: string) {
    // Set active to an entity by id
    this.coursesStore.setActive(id);

    // Navigate to update page
    this.router.navigate(['/update']);
  }

  pageChanged(event: any) {
    // Update pagination at store
    this.coursesStore.update({ pagination: { ...this.pagination, currentPage: event.page } });

    this.loadData();
  }
}
