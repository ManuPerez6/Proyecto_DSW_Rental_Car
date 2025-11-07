import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CharacterService } from '../shared/character.service';
import { Character } from '../shared/character';
import { Subscription } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    RouterModule,
    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.css']
})
export class CharacterFormComponent implements OnInit {
  characterForm!: FormGroup;
  isEditMode = false;
  characterId: string | null = null;
  loading = false;
  error: string | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      characterClass: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]],
      hp: [1, [Validators.required, Validators.min(1)]],
      mana: [0, [Validators.required, Validators.min(0)]],
      attack: [0, [Validators.required, Validators.min(0)]],
      items: this.fb.array([])
    });
  }

  get items() {
    return this.characterForm.get('items') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      characterClass: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]],
      hp: [1, [Validators.required, Validators.min(1)]],
      mana: [0, [Validators.required, Validators.min(0)]],
      attack: [0, [Validators.required, Validators.min(0)]],
      items: this.fb.array([])
    });

    this.characterId = this.route.snapshot.paramMap.get('id');
    if (this.characterId === 'new') {
      this.characterId = null;
    }

    if (this.characterId) {
      this.isEditMode = true;
      this.loadCharacter(this.characterId);
    }
  }

  loadCharacter(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.characterService.getCharacter(id).subscribe({
        next: (character: Character) => {
          this.characterForm.patchValue({
            name: character.name,
            characterClass: character.characterClass,
            level: character.level,
            hp: character.hp,
            mana: character.mana,
            attack: character.attack
          });

          // Limpiar el array de items actual
          const itemsArray = this.characterForm.get('items') as FormArray;
          itemsArray.clear();

          // Agregar los items del personaje al formulario
          if (character.items && character.items.length > 0) {
            character.items.forEach(item => {
              itemsArray.push(this.fb.control(item));
            });
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error cargando. Reintente.';
          this.loading = false;
        }
      })
    );
  }

  addItem(): void {
    this.items.push(this.fb.control(''));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.characterForm.valid) {
      this.loading = true;
      this.error = null;
      
      const formValue = this.characterForm.value;
      const characterData = {
        ...formValue,
        characterclass: formValue.characterClass,
        characterClass: undefined,
        items: formValue.items || []
      };

      let request;
      
      if (this.isEditMode && this.characterId) {
        request = this.characterService.updateCharacter(this.characterId, characterData);
      } else {
        request = this.characterService.addCharacter(characterData as Omit<Character, 'id'>);
      }

      this.subscription.add(
        request.subscribe({
          next: (character) => {
            this.loading = false;
            this.router.navigate(['/character', character.id]);
          },
          error: (err: any) => {
            this.error = `Error ${this.isEditMode ? 'updating' : 'adding'} character. Please try again.`;
            this.loading = false;
          }
        })
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/characters']);
  }
}
