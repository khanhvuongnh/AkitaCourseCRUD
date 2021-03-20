import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CourseRoutingModule } from './course-routing.module';

@NgModule({
  declarations: [
    CourseListComponent,
    CreateCourseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CourseRoutingModule
  ]
})
export class CourseModule { }
