import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(username: string, password: string): Observable<User> {
    const MOCK_USERS: User[] = [
      { id: '1', username: 'admin', name: 'Administrador', role: 'admin' },
      { id: '2', username: 'user', name: 'Usuario de Prueba', role: 'user' }
    ];

    let user: User | undefined;
    
    if (username === 'admin' && password === 'admin') {
      user = MOCK_USERS[0];
    } else if (username === 'user' && password === 'user') {
      user = MOCK_USERS[1];
    }

    if (user) {
      return of(user).pipe(
        delay(500),
        tap(u => {
          localStorage.setItem('currentUser', JSON.stringify(u));
          this.currentUserSubject.next(u);
        })
      );
    } else {
      return throwError(() => new Error('Usuario o contraseña incorrectos'));
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}