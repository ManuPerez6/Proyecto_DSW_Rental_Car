import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from './character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'http://localhost:3000/api/characters';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<Character[]> {
    return this.http.get<{data: Character[]}>(this.apiUrl).pipe(
      map(response => {
        return response?.data || [];
      })
    );
  }

  getCharacter(id: string): Observable<Character> {
    return this.http.get<{data: Character}>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  addCharacter(character: Omit<Character, 'id'>): Observable<Character> {
    return this.http.post<{data: Character}>(this.apiUrl, character).pipe(
      map(response => response.data)
    );
  }

  updateCharacter(id: string, character: Partial<Character>): Observable<Character> {
    return this.http.put<{data: Character}>(`${this.apiUrl}/${id}`, character).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
