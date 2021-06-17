import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from 'src/app/_core/models/course.model';
import { CoursesQuery } from 'src/app/_core/queries/course.query';
import { CategoryService } from 'src/app/_core/services/category.service';
import { CourseService } from 'src/app/_core/services/course.service';
import { CustomNgSnotifyService } from 'src/app/_core/services/custom-ng-snotify.service';
import { SignalrService } from 'src/app/_core/services/signalr.service';
import { CoursesStore } from 'src/app/_core/stores/course.store';
import { FilterParam } from 'src/app/_core/utilities/filter-param';
import { KeyValuePair } from 'src/app/_core/utilities/key-value-pair';
import { MinMaxPrice } from 'src/app/_core/utilities/min-max-price';
import { Pagination } from 'src/app/_core/utilities/pagination';
import { SortBy, SortClass, SortParam } from 'src/app/_core/utilities/search-param';

@UntilDestroy()
@Component({
  selector: 'app-courses-list',
  templateUrl: './course-list.component.html',
})
export class CourseListComponent implements OnInit {
  courseToBeUpdated: Course;
  isUpdateActivated = false;
  courses: Course[] = [];
  categories: KeyValuePair[];
  pagination: Pagination;
  sortColumn = SortColumn;
  sortBy = SortBy;
  minMaxPrice: MinMaxPrice = <MinMaxPrice>{};
  sortParams: SortParam[] = [
    {
      sortColumn: SortColumn.Name,
      sortBy: SortBy.Asc,
      sortClass: SortClass.Asc
    },
    {
      sortColumn: SortColumn.Description,
      sortBy: SortBy.Asc,
      sortClass: SortClass.Asc
    },
    {
      sortColumn: SortColumn.Price,
      sortBy: SortBy.Asc,
      sortClass: SortClass.Asc
    }
  ];
  sortParamIndex: number = 0;
  filterParam: FilterParam = {
    keyword: '',
    category_ID: 0,
    price: null
  };

  constructor(
    private courseService: CourseService,
    private coursesQuery: CoursesQuery,
    private spinnerService: NgxSpinnerService,
    private snotifyService: CustomNgSnotifyService,
    private coursesStore: CoursesStore,
    private router: Router,
    private signalRService: SignalrService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.initSubscription()
    this.getMinMaxPrice();
    this.getCategories();
    this.getData();
  }

  getData() {
    this.courseService
      .getAll(this.pagination, this.sortParams[this.sortParamIndex], this.filterParam)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  search() {
    this.pagination.currentPage = 1;
    this.getData();
  }

  getCategories() {
    this.categoryService
      .getKVCategories()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  getMinMaxPrice() {
    this.courseService
      .getMinMaxPrice()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.minMaxPrice = res;
        this.filterParam.price = this.minMaxPrice.maxPrice;
      });
  }

  deleteCourse(id: string) {
    this.snotifyService.confirm('Are you sure you want to delete this record?', 'Delete Course', () => {
      this.spinnerService.show();
      this.courseService
        .delete(id)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.spinnerService.hide();
          if (res.success) {
            this.snotifyService.success(res.caption, 'Success');
            if (
              this.pagination.currentPage >= this.pagination.totalPage &&
              this.pagination.totalPage > 1 &&
              this.pagination.totalCount - (this.pagination.currentPage - 1) * this.pagination.pageSize === 1) {
              this.pagination.currentPage -= 1;
            }
            this.getMinMaxPrice();
            this.getData();
          } else {
            this.snotifyService.error(res.caption, 'Error');
          }
        }, error => {
          console.log(error);
          this.spinnerService.hide();
        });
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

    this.getData();
  }

  toggleSort(column: SortColumn) {
    var index = this.sortParams.findIndex(v => v.sortColumn === column);
    let currentSortBy = this.sortParams[index].sortBy;
    this.sortParams[index].sortBy = currentSortBy === SortBy.Asc ? SortBy.Desc : SortBy.Asc;
    this.sortParams[index].sortClass = currentSortBy === SortBy.Asc ? SortClass.Desc : SortClass.Asc;
    this.sortParamIndex = index;

    this.getData();
  }

  clearSearch() {
    this.filterParam = {
      keyword: '',
      category_ID: 0,
      price: this.minMaxPrice.maxPrice
    };
    this.sortParams = [
      {
        sortColumn: SortColumn.Name,
        sortBy: SortBy.Asc,
        sortClass: SortClass.Asc
      },
      {
        sortColumn: SortColumn.Description,
        sortBy: SortBy.Asc,
        sortClass: SortClass.Asc
      },
      {
        sortColumn: SortColumn.Price,
        sortBy: SortBy.Asc,
        sortClass: SortClass.Asc
      }
    ];

    this.getData();
  }

  initSubscription() {
    // Create courses subscription
    this.coursesQuery
      .selectAll()
      .pipe(untilDestroyed(this))
      .subscribe(courses => this.courses = courses);

    // Create pagination subscription
    this.coursesQuery
      .select(state => state.pagination)
      .pipe(untilDestroyed(this))
      .subscribe(pagination => this.pagination = pagination);

    // Create categories subscription
    this.coursesQuery
      .select(state => state.categories)
      .pipe(untilDestroyed(this))
      .subscribe(categories => this.categories = categories);

    // Create signalr subscription
    this.signalRService.courseReload
      .pipe(untilDestroyed(this))
      .subscribe(isReload => { if (isReload) this.getData() });
  }
}

enum SortColumn {
  Name = 'Name',
  Description = 'Description',
  Price = 'Price'
};