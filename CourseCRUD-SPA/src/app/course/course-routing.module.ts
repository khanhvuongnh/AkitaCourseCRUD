import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseListComponent } from "./course-list/course-list.component";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { UpdateCourseComponent } from "./update-course/update-course.component";

const routes: Routes = [
  {
    path: '',
    component: CourseListComponent,
  },
  {
    path: 'create',
    component: CreateCourseComponent
  },
  {
    path: 'update',
    component: UpdateCourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }