import { Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { CharacterFormComponent } from './character-form/character-form.component';
import { HomeComponent } from './home/home.component'; // Asegúrate de que esta importación sea correcta

export const routes: Routes = [
  // 1. RUTA PRINCIPAL: Cuando la URL es '/', carga el HomeComponent.
  { path: '', component: HomeComponent }, 

  // 2. RUTAS DE RECURSOS (Autos/Personajes)
  { path: 'characters', component: CharacterListComponent },
  { path: 'character/new', component: CharacterFormComponent },
  { path: 'character/:id', component: CharacterDetailComponent },
  { path: 'character/:id/edit', component: CharacterFormComponent },
  
  // 3. RUTA WILDCARD: Redirige cualquier ruta no encontrada a la lista de personajes.
  { path: '**', redirectTo: '/characters' } 
];