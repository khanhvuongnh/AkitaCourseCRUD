import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CourseRoutingModule } from './course-routing.module';
import { UpdateCourseComponent } from './update-course/update-course.component';

@NgModule({
  declarations: [
    CourseListComponent,
    CreateCourseComponent,
    UpdateCourseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CourseRoutingModule,
    ReactiveFormsModule
  ]
})
export class CourseModule { }
