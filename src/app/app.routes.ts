import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  // 1. RUTAS PÚBLICAS
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // 2. RUTAS PARA USUARIOS LOGUEADOS (user y admin)
  {
    path: 'car',
    component: CarListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'car/:id',
    component: CarDetailComponent,
    canActivate: [authGuard]
  },

  // 3. RUTAS SOLO PARA ADMIN
  {
    path: 'car/new',
    component: CarFormComponent,
    canActivate: [adminGuard] 
  },
  {
    path: 'car/:id/edit',
    component: CarFormComponent,
    canActivate: [adminGuard] 
  },

  // 4. RUTA WILDCARD
  { path: '**', redirectTo: '' }
];
