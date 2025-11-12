import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car';
import { Subscription } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit, OnDestroy {
  car: Car | null = null;
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCar(id as string);
    }
  }

  loadCar(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.carService.getCar(id).subscribe({
        next: (data: Car) => {
          this.car = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al cargar el auto. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
        }
      })
    );
  }

  deleteCar(): void {
    if (!this.car?.id) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      this.subscription.add(
        this.carService.deleteCar(this.car.id).subscribe({
          next: () => this.goBack(),
          error: (err: any) => {
            this.error = 'Error al eliminar el auto. Por favor, inténtalo de nuevo.';
          }
        })
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/cars']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
