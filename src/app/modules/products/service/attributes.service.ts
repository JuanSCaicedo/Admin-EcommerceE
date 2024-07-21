import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  configAll() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_SERVICIOS + '/admin/variations/config';
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createSpecification(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_SERVICIOS + '/admin/specifications';
    return this.http.post(url, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    ); 
  }

  showProduct(product_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_SERVICIOS + '/admin/products/' + product_id;
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listSpecification(product_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_SERVICIOS + '/admin/specifications?product_id=' + product_id;
    return this.http.get(url, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
