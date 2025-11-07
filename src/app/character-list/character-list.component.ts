import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../shared/character.service';
import { Character } from '../shared/character';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-character-list',
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
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'characterClass', 'level', 'hp', 'mana', 'attack', 'items', 'actions'];
  dataSource: Character[] = [];
  loading = true;
  error: string | null = null;

  constructor(private characterService: CharacterService) {}


  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    console.log('Loading characters...');
    this.characterService.getCharacters().subscribe({
      next: (data) => {
        console.log('Characters received:', data);
        this.dataSource = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading characters', err);
        this.error = 'Error loading characters. Please try again later.';
        this.dataSource = [];
        this.loading = false;
      }
    });
  }

  deleteCharacter(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      this.loading = true;
      this.characterService.deleteCharacter(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter((character: Character) => character.id !== id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting character', err);
          this.error = 'Error al eliminar el personaje. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
