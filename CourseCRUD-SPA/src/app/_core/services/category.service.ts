import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CoursesStore } from "../stores/course.store";
import { KeyValuePair } from "../utilities/key-value-pair";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private coursesStore: CoursesStore) { }

  getKVCategories() {
    return this.http.get<KeyValuePair[]>(`${this.apiUrl}/Category/All`).pipe(
      tap(categories => {
        categories.unshift(<KeyValuePair>{ key: 0, value: 'Select a category...' });
        this.coursesStore.update({ categories });
      })
    )
  }
}