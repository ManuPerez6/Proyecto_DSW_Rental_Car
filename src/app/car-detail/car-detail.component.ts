import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { RentalService } from '../shared/rental.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit, OnDestroy {
  car: Car | null = null;
  loading = true;
  loadingRental = false; 
  error: string | null = null;
  private subscription: Subscription = new Subscription();
  
  currentUser: any | null = null;
  rentalForm: FormGroup;
  calculatedPrice: number | null = null;
  minDate: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private rentalService: RentalService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder 
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.minDate = new Date(); 


    this.rentalForm = this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: ['', Validators.required]
    });
  }

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
        }
      })
    );
  }


  calculatePrice(): void {
    if (this.rentalForm.invalid || !this.car) {
      this.calculatedPrice = null;
      return;
    }
    
    const { startDate, endDate } = this.rentalForm.value;
    
    if (endDate <= startDate) {
      this.snackBar.open('La fecha de fin debe ser posterior a la fecha de inicio', 'Cerrar', { duration: 3000 });
      this.calculatedPrice = null;
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    this.calculatedPrice = diffDays * this.car.price;
  }

  confirmRental(): void {
    if (this.rentalForm.invalid || !this.car || !this.calculatedPrice) {
      return;
    }

    this.loadingRental = true;
    const { startDate, endDate } = this.rentalForm.value;

    this.subscription.add(
      this.rentalService.createRental(this.car, startDate, endDate, this.calculatedPrice).subscribe({
        next: (rental) => {
          this.loadingRental = false;
          this.snackBar.open(`¡Alquiler confirmado! ID: ${rental.id}`, 'Genial', { duration: 5000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/car']);
        },
        error: (err) => {
          this.loadingRental = false;
          this.snackBar.open(err.message || 'Error al procesar el alquiler.', 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      })
    );
  }


  goBack(): void {
    this.router.navigate(['/car']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}