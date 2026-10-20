import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://127.0.0.1:8000/api';

  get<T>(path: string, params: Record<string, any> = {}) {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== '' && v !== null && v !== undefined) p = p.set(k, v);
    }
    return this.http.get<T>(`${this.base}${path}`, { params: p });
  }

  post<T>(path: string, body: any = {}) {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: any = {}) {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  patch<T>(path: string, body: any = {}) {
    return this.http.patch<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.base}${path}`);
  }
}