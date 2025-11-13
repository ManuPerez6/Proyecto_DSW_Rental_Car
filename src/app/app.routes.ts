import { Routes } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { CarFormComponent } from './car-form/car-form.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  // 1. RUTA PRINCIPAL: Cuando la URL es '/', carga el HomeComponent.
  { path: '', component: HomeComponent },

  // 2. RUTAS DE RECURSOS (Autos)
  { path: 'car', component: CarListComponent },
  { path: 'car/new', component: CarFormComponent },
  { path: 'car/:id', component: CarDetailComponent },
  { path: 'car/:id/edit', component: CarFormComponent },

  // 3. RUTA WILDCARD: Redirige cualquier ruta no encontrada a la lista de autos.
  { path: '**', redirectTo: '/car' }
];
