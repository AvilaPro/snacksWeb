import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Producto } from '../models/producto.model';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Productos</h2>
      
      <form (ngSubmit)="onSubmit()" #form="ngForm" class="form-card">
        <h3>{{ editingId ? 'Editar' : 'Nuevo' }} Producto</h3>
        
        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="producto.nombre" name="nombre" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Categoría:</label>
          <select [(ngModel)]="producto.categoria" name="categoria" required class="form-control">
            <option value="">Seleccionar...</option>
            <option value="Snack Salado">Snack Salado</option>
            <option value="Snack Dulce">Snack Dulce</option>
            <option value="Bebida Fría">Bebida Fría</option>
            <option value="Bebida Caliente">Bebida Caliente</option>
            <option value="Fruta">Fruta</option>
            <option value="Postre">Postre</option>
            <option value="Comida Principal">Comida Principal</option>
            <option value="Ensalada">Ensalada</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Pizza">Pizza</option>
            <option value="Helado">Helado</option>
            <option value="Galletas">Galletas</option>
            <option value="Chocolates">Chocolates</option>
            <option value="Jugos Naturales">Jugos Naturales</option>
            <option value="Gaseosas">Gaseosas</option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="button" (click)="cancelar()" class="btn-secondary">Cancelar</button>
          <button type="submit" [disabled]="!form.valid" class="btn-primary">
            {{ editingId ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>

      <div class="productos-list">
        <h3>Productos Existentes</h3>
        <div *ngFor="let p of productos" class="producto-item">
          <div class="producto-info">
            <strong>{{ p.nombre }}</strong>
            <span class="categoria">{{ p.categoria }}</span>
          </div>
          <div class="producto-actions">
            <button (click)="editar(p)" class="btn-edit">Editar</button>
            <button (click)="eliminar(p.id)" class="btn-delete">Eliminar</button>
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
    .btn-primary { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #28a745; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
    .btn-delete { background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; }
    .productos-list { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .producto-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    .categoria { background: #f8f9fa; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-left: 0.5rem; }
  `]
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  producto = { nombre: '', categoria: '', disponible: true };
  editingId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe({
      next: (productos) => this.productos = productos,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  onSubmit() {
    if (this.editingId) {
      this.apiService.updateProducto(this.editingId, this.producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelar();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.apiService.createProducto(this.producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelar();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  editar(producto: Producto) {
    this.editingId = producto.id;
    this.producto = { ...producto };
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  cancelar() {
    this.editingId = null;
    this.producto = { nombre: '', categoria: '', disponible: true };
  }
}