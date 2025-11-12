import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car } from './car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:3000/api/Cars';

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<{data: Car[]}>(this.apiUrl).pipe(
      map(response => {
        return response?.data || [];
      })
    );
  }

  getCar(id: string | number): Observable<Car> {
    return this.http.get<{data: Car}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  addCar(character: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<{data: Car}>(this.apiUrl, character).pipe(
      map(response => response.data)
    );
  }

  updateCar(id: string | number, character: Partial<Car>): Observable<Car> {
    return this.http.put<{data: Car}>(`${this.apiUrl}/${id}`, character).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  deleteCar(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
