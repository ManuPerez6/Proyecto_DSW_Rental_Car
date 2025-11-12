import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  displayedColumns: string[] = ['Marca', 'Modelo', 'Year', 'Color', 'Precio'];
  dataSource: Car[] = [];
  loading = true;
  error: string | null = null;

  constructor(private carService: CarService) {}


  ngOnInit(): void {
    this.loadCar();
  }

  loadCar(): void {
    this.loading = true;
    console.log('Reservando auto...');
    this.carService.getCars().subscribe({
      next: (data) => {
        console.log('Auto recibido:', data);
        this.dataSource = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el auto', err);
        this.error = 'Error Al cargar el auto. Inténtelo más tarde .';
        this.dataSource = [];
        this.loading = false;
      }
    });
  }

  deleteCar(id: number): void {
  if (confirm('¿Estás seguro de que quieres eliminar este auto?')) {
    this.loading = true;
    this.carService.deleteCar(id).subscribe({
      next: () => {

        this.dataSource = this.dataSource.filter((car: Car) => car.id !== id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al eliminar el auto', err);
        this.error = 'Error al eliminar el auto. Por favor, inténtalo de nuevo.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
}
