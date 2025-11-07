import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CharacterService } from '../shared/character.service';
import { Character } from '../shared/character';
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
  selector: 'app-character-detail',
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
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  character: Character | null = null;
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharacter(id);
    }
  }

  loadCharacter(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.characterService.getCharacter(id).subscribe({
        next: (data: Character) => {
          this.character = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al cargar el personaje. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
        }
      })
    );
  }

  deleteCharacter(): void {
    if (!this.character?.id) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      this.subscription.add(
        this.characterService.deleteCharacter(this.character.id).subscribe({
          next: () => this.goBack(),
          error: (err: any) => {
            this.error = 'Error al eliminar el personaje. Por favor, inténtalo de nuevo.';
          }
        })
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/characters']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
