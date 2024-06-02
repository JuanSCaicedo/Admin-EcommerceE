import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listCategories(search: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories';
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configCategories(search: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories/config';
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createCategories(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories';
    return this.http.post(url, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showCategorie(categorie_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories/' + categorie_id;
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateCategories(categorie_id:string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories/' + categorie_id;
    return this.http.post(url, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  daleteCategorie(categorie_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let url = URL_SERVICIOS + '/admin/categories/' + categorie_id;
    return this.http.delete(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
