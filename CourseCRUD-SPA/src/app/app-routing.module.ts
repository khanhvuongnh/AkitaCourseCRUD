import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListComponent } from './course/course-list/course-list.component';
import { CreateCourseComponent } from './course/create-course/create-course.component';
import { CourseResolver } from './_core/resolvers/course.resolver';

const routes: Routes = [
  {
    path: 'courses',
    resolve: { data: CourseResolver },
    component: CourseListComponent
  },
  {
    path: 'create-course',
    component: CreateCourseComponent
  },
  {
    path: '**',
    redirectTo: 'courses'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
