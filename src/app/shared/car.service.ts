import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Car } from './car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  
  private MOCK_CARS: Car[] = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Plata', price: 150, available: true, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=Toyota+Corolla' },
    { id: 2, brand: 'Ford', model: 'Mustang', year: 2023, color: 'Rojo', price: 300, available: true, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=Ford+Mustang' },
    { id: 3, brand: 'Honda', model: 'Civic', year: 2022, color: 'Azul', price: 130, available: false, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=Honda+Civic' },
    { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2024, color: 'Amarillo', price: 320, available: true, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=Chevrolet+Camaro' },
    { id: 5, brand: 'BMW', model: 'Serie 3', year: 2023, color: 'Negro', price: 280, available: true, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=BMW+Serie+3' },
    { id: 6, brand: 'Audi', model: 'A4', year: 2022, color: 'Blanco', price: 260, available: true, imageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=Audi+A4' }
  ];

  private nextId = 7;

  constructor() {}

  getCars(): Observable<Car[]> {
    console.log('Servicio Mock: Obteniendo todos los autos...');
    return of(this.MOCK_CARS).pipe(delay(500));
  }

  getCar(id: string | number): Observable<Car> {
    console.log(`Servicio Mock: Obteniendo auto con id ${id}`);
    const carId = Number(id);
    const car = this.MOCK_CARS.find(c => c.id === carId);
    
    if (car) {
      return of(car).pipe(delay(300));
    } else {
      return throwError(() => new Error('Auto no encontrado'));
    }
  }

  addCar(carData: Omit<Car, 'id' | 'imageUrl'>): Observable<Car> {
    console.log('Servicio Mock: Añadiendo auto nuevo');
    const newCar: Car = {
      ...carData,
      id: this.nextId++,
      imageUrl: `https://placehold.co/600x400/EFEFEF/333?text=${carData.brand}+${carData.model}`
    };
    this.MOCK_CARS.push(newCar);
    return of(newCar).pipe(delay(500));
  }

  updateCar(id: string | number, carData: Partial<Car>): Observable<Car> {
    console.log(`Servicio Mock: Actualizando auto con id ${id}`);
    const carId = Number(id);
    const index = this.MOCK_CARS.findIndex(c => c.id === carId);

    if (index !== -1) {
      const updatedCar = { ...this.MOCK_CARS[index], ...carData };
      this.MOCK_CARS[index] = updatedCar;
      return of(updatedCar).pipe(delay(500));
    } else {
      return throwError(() => new Error('Auto no encontrado para actualizar'));
    }
  }

  deleteCar(id: string | number): Observable<void> {
    console.log(`Servicio Mock: Eliminando auto con id ${id}`);
    const carId = Number(id);
    const index = this.MOCK_CARS.findIndex(c => c.id === carId);

    if (index !== -1) {
      this.MOCK_CARS.splice(index, 1);
      return of(undefined).pipe(delay(500));
    } else {
      return throwError(() => new Error('Auto no encontrado para eliminar'));
    }
  }
}