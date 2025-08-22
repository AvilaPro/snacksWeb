import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdmin = false;

  checkAdminPassword(): boolean {
    const password = prompt('Ingresa la contraseña de administrador:');
    if (password === '123') {
      this.isAdmin = true;
      return true;
    }
    return false;
  }

  resetAdmin(): void {
    this.isAdmin = false;
  }

  isAdminAuthenticated(): boolean {
    return this.isAdmin;
  }
}