import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car';
import { Subscription } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatSlideToggleModule 
  ],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit, OnDestroy {
  carForm!: FormGroup;
  isEditMode = false;
  carId: string | null = null;
  loading = false;
  error: string | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      color: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true, Validators.required] 
    });

    this.carId = this.route.snapshot.paramMap.get('id');
    if (this.carId === 'new') {
      this.carId = null;
    }

    if (this.carId) {
      this.isEditMode = true;
      this.loadCar(this.carId);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCar(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.carService.getCar(id).subscribe({
        next: (car: Car) => {

          this.carForm.patchValue({
            brand: car.brand,
            model: car.model,
            year: car.year,
            color: car.color,
            price: car.price,
            available: car.available 
          });
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error cargando el auto. Reintente.';
          this.loading = false;
        }
      })
    );
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.loading = true;
      this.error = null;
      const carData: Omit<Car, 'id' | 'imageUrl'> = this.carForm.value; 

      let request;
      if (this.isEditMode && this.carId) {
        request = this.carService.updateCar(this.carId, this.carForm.value);
      } else {
        request = this.carService.addCar(carData);
      }

      this.subscription.add(
        request.subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/car']);
          },
          error: (err: any) => {
            this.error = `Error al ${this.isEditMode ? 'actualizar' : 'agregar'} el auto.`;
            this.loading = false;
          }
        })
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/car']);
  }
}