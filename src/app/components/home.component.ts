import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="welcome-card" *ngIf="!reunion">
        <h1>¡Bienvenido a SnacksControl!</h1>
        <p class="subtitle">La forma más fácil de organizar los snacks para tu reunión</p>
        
        <div class="features">
          <div class="feature">
            <h3>📋 Organiza</h3>
            <p>Crea listas de productos que necesitas para tu reunión</p>
          </div>
          <div class="feature">
            <h3>👥 Comparte</h3>
            <p>Los participantes pueden ver qué llevar y asignarse productos</p>
          </div>
          <div class="feature">
            <h3>✅ Controla</h3>
            <p>Evita duplicados y asegúrate de que no falte nada</p>
          </div>
        </div>
        
        <div class="instructions">
          <h3>¿Cómo funciona?</h3>
          <ol>
            <li>El organizador crea una reunión y agrega productos</li>
            <li>Los participantes acceden al enlace de la reunión</li>
            <li>Cada persona selecciona qué productos va a llevar</li>
            <li>¡Listo! Todos saben qué llevar sin duplicados</li>
          </ol>
        </div>
        
        <p class="no-reunion">No hay reuniones activas en este momento.</p>
      </div>
      
      <div *ngIf="reunion" class="reunion-active">
        <h2>Reunión Activa</h2>
        <button (click)="goToReunion()" class="btn-reunion">Ver Reunión: {{ reunion.nombre_reunion }}</button>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .welcome-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: #333; margin-bottom: 0.5rem; font-size: 2.5rem; }
    .subtitle { color: #666; font-size: 1.2rem; margin-bottom: 2rem; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
    .feature { padding: 1rem; border: 1px solid #eee; border-radius: 8px; }
    .feature h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }
    .instructions { text-align: left; background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; }
    .instructions ol { margin: 1rem 0; }
    .instructions li { margin: 0.5rem 0; }
    .no-reunion { color: #888; font-style: italic; margin-top: 2rem; }
    .reunion-active { text-align: center; }
    .btn-reunion { background: #007bff; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; cursor: pointer; }
    .btn-reunion:hover { background: #0056b3; }
  `]
})
export class HomeComponent implements OnInit {
  reunion: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getLatestReunion().subscribe({
      next: (reunion) => {
        this.reunion = reunion;
      },
      error: () => {
        this.reunion = null;
      }
    });
  }

  goToReunion() {
    if (this.reunion) {
      this.router.navigate(['/reunion', this.reunion.id]);
    }
  }
}