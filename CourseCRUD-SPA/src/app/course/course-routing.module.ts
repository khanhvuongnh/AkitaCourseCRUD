import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseResolver } from "../_core/resolvers/course.resolver";
import { CourseListComponent } from "./course-list/course-list.component";
import { CreateCourseComponent } from "./create-course/create-course.component";

const routes: Routes = [
  {
    path: '',
    resolve: { res: CourseResolver },
    component: CourseListComponent,
  },
  {
    path: 'create',
    component: CreateCourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }