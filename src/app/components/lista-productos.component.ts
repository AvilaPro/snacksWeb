import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto, Asignacion } from '../models/producto.model';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="productos-grid">
      <div *ngFor="let producto of productos" class="producto-card" [class.asignado]="isAsignado(producto.id)">
        <div class="producto-imagen-placeholder">📦</div>
        <h3>{{ producto.nombre }}</h3>
        <span class="categoria">{{ producto.categoria }}</span>
        <div *ngIf="isAsignado(producto.id)" class="asignacion-info">
          <p><strong>{{ getAsignacion(producto.id)?.nombre_amigo }}</strong></p>
          <p>Cantidad: {{ getAsignacion(producto.id)?.cantidad }}</p>
          <p *ngIf="getAsignacion(producto.id)?.comentario">{{ getAsignacion(producto.id)?.comentario }}</p>
        </div>
        <button *ngIf="!isAsignado(producto.id)" (click)="onSeleccionar(producto)" class="btn-seleccionar">
          Seleccionar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .producto-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: transform 0.2s;
    }
    .producto-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .producto-card.asignado {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }
    .producto-imagen-placeholder {
      width: 100%;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      background: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .categoria {
      background: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    .asignacion-info {
      background: #f9f9f9;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0;
    }
    .btn-seleccionar {
      background: #2196f3;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-seleccionar:hover {
      background: #1976d2;
    }
  `]
})
export class ListaProductosComponent {
  @Input() productos: Producto[] = [];
  @Input() asignaciones: Asignacion[] = [];
  @Output() seleccionar = new EventEmitter<Producto>();

  onSeleccionar(producto: Producto) {
    this.seleccionar.emit(producto);
  }

  isAsignado(productoId: number): boolean {
    return this.asignaciones.some(a => a.id_producto === productoId);
  }

  getAsignacion(productoId: number): Asignacion | undefined {
    return this.asignaciones.find(a => a.id_producto === productoId);
  }
}