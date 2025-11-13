import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car';
import { AuthService } from '../shared/auth.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  
  allCars: Car[] = []; 
  filteredCars: Car[] = [];
  
  loading = true;
  error: string | null = null;
  isAdmin$: Observable<boolean>;

  filterForm: FormGroup;
  private filterSub!: Subscription;

  constructor(
    private carService: CarService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
    
    this.filterForm = this.fb.group({
      searchText: [''],
      showAvailableOnly: [true]
    });
  }

  ngOnInit(): void {
    this.loadCars();
    
    this.filterSub = this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(values => {
      this.applyFilters(values.searchText, values.showAvailableOnly);
    });
  }

  ngOnDestroy(): void {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }

  loadCars(): void {
    this.loading = true;
    this.carService.getCars().subscribe({
      next: (data) => {
        this.allCars = Array.isArray(data) ? data : [];
        this.applyFilters(
          this.filterForm.value.searchText, 
          this.filterForm.value.showAvailableOnly
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los autos. Inténtelo más tarde.';
        this.loading = false;
      }
    });
  }

  applyFilters(searchText: string, showAvailableOnly: boolean): void {
    const filterText = searchText.toLowerCase().trim();
    
    this.filteredCars = this.allCars.filter(car => {
      const availableMatch = !showAvailableOnly || car.available;
      
      const textMatch = filterText === '' || 
        car.brand.toLowerCase().includes(filterText) ||
        car.model.toLowerCase().includes(filterText) ||
        car.year.toString().includes(filterText);
        
      return availableMatch && textMatch;
    });
  }

  deleteCar(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      this.loading = true;
      this.carService.deleteCar(id).subscribe({
        next: () => {
          this.allCars = this.allCars.filter((car: Car) => car.id !== id);
          this.applyFilters(
            this.filterForm.value.searchText, 
            this.filterForm.value.showAvailableOnly
          );
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al eliminar el auto. Por favor, inténtalo de nuevo.';
          this.loading = false;
        }
      });
    }
  }
}