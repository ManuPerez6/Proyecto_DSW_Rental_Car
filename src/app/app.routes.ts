import { Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { CharacterFormComponent } from './character-form/character-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent },
  { path: 'character/new', component: CharacterFormComponent },
  { path: 'character/:id', component: CharacterDetailComponent },
  { path: 'character/:id/edit', component: CharacterFormComponent },
  { path: '**', redirectTo: '/characters' }
];
