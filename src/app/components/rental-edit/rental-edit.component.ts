import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RentalService } from '../../shared/services/rental.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rental-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './rental-edit.component.html',
  styleUrls: ['./rental-edit.component.css']
})

export class RentalEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private rentalService = inject(RentalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dateAdapter = inject(DateAdapter);
  rentalId: number | null = null;
  rental: any = null;
  loading = true;
  form = this.fb.group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required]
  });

  ngOnInit(): void {
    try { this.dateAdapter.setLocale('es-ES'); } catch (e) { /* ignore if not available */ }
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const nid = Number(idParam);
      if (!isNaN(nid)) {
        this.rentalId = nid;
        this.loadRental(nid);
      }
    }
  }

  loadRental(id: number): void {
    this.loading = true;
    this.rentalService.getRentalById(id).subscribe({
      next: (r) => {
        this.rental = r;
        const startDateObj = r.startDate ? new Date(r.startDate) : null;
        const endDateObj = r.endDate ? new Date(r.endDate) : null;
        this.form.patchValue({
            startDate: startDateObj, 
            endDate: endDateObj,     
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error cargando alquiler', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid || this.rentalId === null) return;
    const data = {
      ...this.rental,
      startDate: this.formatDate(this.form.value.startDate),
      endDate: this.formatDate(this.form.value.endDate)
    };
    this.rentalService.patchRental(this.rentalId, data).subscribe({
      next: (res) => {
        this.snackBar.open('Alquiler actualizado', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/rentals']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private formatDate(d: any): string {
    if (!d) return '';
    const date = (d instanceof Date) ? d : new Date(d);
    return date.toISOString().split('T')[0];
  }
}
