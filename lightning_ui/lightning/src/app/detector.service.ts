import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  constructor(private http: HttpClient) {
  }
  getAll() {

    return this.http.get<string>(`${environment.apiUrl}/detectorlist`).pipe();

  }

  getByID(id: number) {
    return this.http.get<string>(`${environment.apiUrl}/detector/${id}`);
  }

}
