import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Reunion } from '../models/producto.model';

@Component({
  selector: 'app-admin-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Gestión de Reuniones</h2>
      
      <form (ngSubmit)="onSubmit()" #form="ngForm" class="form-card">
        <h3>{{ editingId ? 'Editar' : 'Nueva' }} Reunión</h3>
        
        <div class="form-group">
          <label>Nombre de la reunión:</label>
          <input type="text" [(ngModel)]="reunion.nombre_reunion" name="nombre_reunion" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Fecha:</label>
          <input type="date" [(ngModel)]="reunion.fecha" name="fecha" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Descripción:</label>
          <textarea [(ngModel)]="reunion.descripcion" name="descripcion" class="form-control" rows="3"></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" (click)="cancelar()" class="btn-secondary">Cancelar</button>
          <button type="submit" [disabled]="!form.valid" class="btn-primary">
            {{ editingId ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>

      <div class="reuniones-list">
        <h3>Reuniones Existentes</h3>
        <div *ngFor="let r of reuniones" class="reunion-item">
          <div class="reunion-info">
            <strong>{{ r.nombre_reunion }}</strong>
            <p>{{ r.fecha | date:'shortDate' }}</p>
            <p>{{ r.descripcion }}</p>
          </div>
          <div class="reunion-actions">
            <a [routerLink]="['/reunion', r.id]" class="btn-view">Ver</a>
            <button (click)="editar(r)" class="btn-edit">Editar</button>
            <button (click)="eliminar(r.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 1rem; }
    .form-card { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .btn-secondary { background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .btn-view { background: #17a2b8; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; text-decoration: none; margin-right: 0.5rem; }
    .btn-edit { background: #28a745; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
    .btn-delete { background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; }
    .reuniones-list { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .reunion-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee; }
    .reunion-info p { margin: 0.25rem 0; color: #666; }
  `]
})
export class AdminReunionesComponent implements OnInit {
  reuniones: Reunion[] = [];
  reunion = { nombre_reunion: '', fecha: '', descripcion: '' };
  editingId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarReuniones();
  }

  cargarReuniones() {
    this.apiService.getReuniones().subscribe({
      next: (reuniones) => this.reuniones = reuniones,
      error: (err) => console.error('Error al cargar reuniones:', err)
    });
  }

  onSubmit() {
    if (this.editingId) {
      this.apiService.updateReunion(this.editingId, this.reunion).subscribe({
        next: () => {
          this.cargarReuniones();
          this.cancelar();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.apiService.createReunion(this.reunion).subscribe({
        next: () => {
          this.cargarReuniones();
          this.cancelar();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  editar(reunion: Reunion) {
    this.editingId = reunion.id;
    this.reunion = { ...reunion };
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta reunión?')) {
      this.apiService.deleteReunion(id).subscribe({
        next: () => this.cargarReuniones(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  cancelar() {
    this.editingId = null;
    this.reunion = { nombre_reunion: '', fecha: '', descripcion: '' };
  }
}