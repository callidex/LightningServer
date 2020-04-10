import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Detector } from './detector.model';
import { DetectorList } from './detector-list.model';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  constructor(private http: HttpClient) {
  }
  getAll() {

    return this.http.get<DetectorList>(`${environment.apiUrl}/detectorlist`).pipe();

  }

  getByID(id: number) {
    return this.http.get<Detector>(`${environment.apiUrl}/detector/${id}`);
  }

}
