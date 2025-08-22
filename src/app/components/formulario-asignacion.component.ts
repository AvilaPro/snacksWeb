import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/producto.model';

@Component({
  selector: 'app-formulario-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="productoSeleccionado">
      <div class="modal-content">
        <h2>Asignar Producto</h2>
        <div class="producto-info">
          <h3>{{ productoSeleccionado.nombre }}</h3>
          <span class="categoria">{{ productoSeleccionado.categoria }}</span>
        </div>
        
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="nombreAmigo">Tu nombre:</label>
            <input 
              type="text" 
              id="nombreAmigo" 
              [(ngModel)]="nombreAmigo" 
              name="nombreAmigo" 
              required 
              class="form-control">
          </div>
          
          <div class="form-group">
            <label for="cantidad">Cantidad:</label>
            <input 
              type="number" 
              id="cantidad" 
              [(ngModel)]="cantidad" 
              name="cantidad" 
              min="1" 
              required 
              class="form-control">
          </div>
          
          <div class="form-group">
            <label for="comentario">Comentario (opcional):</label>
            <textarea 
              id="comentario" 
              [(ngModel)]="comentario" 
              name="comentario" 
              class="form-control"
              placeholder="Ej: Lo compro en la tarde"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" (click)="onCancelar()" class="btn-cancelar">Cancelar</button>
            <button type="submit" [disabled]="!form.valid" class="btn-confirmar">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
    }
    .producto-info {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .categoria {
      background: #e0e0e0;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
    .btn-cancelar {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-confirmar {
      background: #4caf50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-confirmar:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class FormularioAsignacionComponent {
  @Input() productoSeleccionado: Producto | null = null;
  @Output() asignar = new EventEmitter<{producto: Producto, nombreAmigo: string, cantidad: number, comentario?: string}>();
  @Output() cancelar = new EventEmitter<void>();

  nombreAmigo = '';
  cantidad = 1;
  comentario = '';

  onSubmit() {
    if (this.productoSeleccionado) {
      this.asignar.emit({
        producto: this.productoSeleccionado,
        nombreAmigo: this.nombreAmigo,
        cantidad: this.cantidad,
        comentario: this.comentario || undefined
      });
      this.resetForm();
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.resetForm();
  }

  private resetForm() {
    this.nombreAmigo = '';
    this.cantidad = 1;
    this.comentario = '';
  }
}