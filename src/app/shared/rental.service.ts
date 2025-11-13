import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap, tap, map } from 'rxjs/operators';
import { Rental } from './rental';
import { Car } from './car';
import { User } from './user';
import { AuthService } from './auth.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  
  private MOCK_RENTALS: Rental[] = [];
  private nextId = 1;

  constructor(
    private authService: AuthService,
    private carService: CarService
  ) { }

  createRental(car: Car, startDate: Date, endDate: Date, price: number): Observable<Rental> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return throwError(new Error('Usuario no autenticado'));
    }

    if (!car.available) {
      return throwError(new Error('El auto ya no está disponible'));
    }

    console.log('Servicio Mock: Creando alquiler...');

    const newRental: Rental = {
      id: this.nextId++,
      user: currentUser,
      car: car,
      startDate: startDate,
      endDate: endDate,
      price: price
    };

    return of(newRental).pipe(
      delay(1000),
      switchMap(createdRental => {
        return this.carService.updateCar(car.id, { available: false }).pipe(
          map(() => {
            this.MOCK_RENTALS.push(createdRental);
            console.log('Servicio Mock: Alquiler creado y auto actualizado.', createdRental);
            return createdRental;
          })
        );
      })
    );
  }

  getRentals(): Observable<Rental[]> {
    return of(this.MOCK_RENTALS).pipe(delay(500));
  }

  deleteRental(rentalId: number): Observable<void> {
    const index = this.MOCK_RENTALS.findIndex(r => r.id === rentalId);
    if (index === -1) {
      return throwError(new Error('Alquiler no encontrado'));
    }

    const rental = this.MOCK_RENTALS[index];

    return this.carService.updateCar(rental.car.id, { available: true }).pipe(
      tap(() => {
        this.MOCK_RENTALS.splice(index, 1);
        console.log(`Servicio Mock: Alquiler ${rentalId} eliminado y auto ${rental.car.id} liberado.`);
      }),
      map(() => undefined)
    );
  }
}