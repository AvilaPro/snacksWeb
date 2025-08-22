import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ListaProductosComponent } from './lista-productos.component';
import { FormularioAsignacionComponent } from './formulario-asignacion.component';
import { Producto, Reunion, Asignacion } from '../models/producto.model';

@Component({
  selector: 'app-reunion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaProductosComponent, FormularioAsignacionComponent],
  template: `
    <div class="container">
      <header class="reunion-header" *ngIf="reunion">
        <h1>{{ reunion.nombre_reunion }}</h1>
        <p>{{ reunion.fecha | date:'fullDate' }}</p>
        <p>{{ reunion.descripcion }}</p>
      </header>

      <div class="stats" *ngIf="productos.length > 0">
        <div class="stat-card">
          <h3>{{ asignaciones.length }}</h3>
          <p>Productos asignados</p>
        </div>
        <div class="stat-card">
          <h3>{{ productos.length - asignaciones.length }}</h3>
          <p>Productos disponibles</p>
        </div>
      </div>

      <div class="filter-section" *ngIf="productos.length > 0">
        <label for="categoriaFilter">Filtrar por categoría:</label>
        <select id="categoriaFilter" [(ngModel)]="categoriaSeleccionada" (change)="filtrarProductos()" class="filter-select">
          <option value="">Todas las categorías</option>
          <option *ngFor="let categoria of categorias" [value]="categoria">{{ categoria }}</option>
        </select>
      </div>

      <div *ngFor="let categoria of categoriasConProductos" class="categoria-section">
        <h2 class="categoria-title">{{ categoria }}</h2>
        <app-lista-productos 
          [productos]="getProductosPorCategoria(categoria)" 
          [asignaciones]="asignaciones"
          (seleccionar)="onSeleccionarProducto($event)">
        </app-lista-productos>
      </div>

      <app-formulario-asignacion
        [productoSeleccionado]="productoSeleccionado"
        (asignar)="onAsignarProducto($event)"
        (cancelar)="onCancelarAsignacion()">
      </app-formulario-asignacion>

      <div *ngIf="loading" class="loading">
        Cargando...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .reunion-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
    }
    .reunion-header h1 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      font-size: 2rem;
      margin: 0;
      color: #2196f3;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      font-size: 1.2rem;
    }
    .error {
      background: #f44336;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
    }
    .filter-section {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-left: 0.5rem;
    }
    .categoria-section {
      margin-bottom: 3rem;
    }
    .categoria-title {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ReunionDetalleComponent implements OnInit {
  reunion: Reunion | null = null;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  asignaciones: Asignacion[] = [];
  productoSeleccionado: Producto | null = null;
  loading = false;
  error = '';
  categoriaSeleccionada = '';
  categorias: string[] = [];
  categoriasConProductos: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const reunionId = Number(this.route.snapshot.paramMap.get('id'));
    if (reunionId) {
      this.cargarDatos(reunionId);
    }
  }

  cargarDatos(reunionId: number) {
    this.loading = true;
    this.error = '';

    this.apiService.getReunion(reunionId).subscribe({
      next: (reunion) => this.reunion = reunion,
      error: (err) => this.error = 'Error al cargar la reunión'
    });

    this.apiService.getProductosReunion(reunionId).subscribe({
      next: (data) => {
        this.productos = data.productos || [];
        this.asignaciones = data.asignaciones || [];
        this.setupCategorias();
        this.filtrarProductos();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  onSeleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
  }

  onAsignarProducto(data: {producto: Producto, nombreAmigo: string, cantidad: number, comentario?: string}) {
    const reunionId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.apiService.asignarProducto(
      reunionId,
      data.producto.id,
      data.nombreAmigo,
      data.cantidad,
      data.comentario
    ).subscribe({
      next: (asignacion) => {
        this.asignaciones.push(asignacion);
        this.productoSeleccionado = null;
      },
      error: (err) => {
        this.error = 'Error al asignar el producto';
      }
    });
  }

  onCancelarAsignacion() {
    this.productoSeleccionado = null;
  }

  setupCategorias() {
    this.categorias = [...new Set(this.productos.map(p => p.categoria))];
    this.categoriasConProductos = this.categorias.filter(categoria => 
      this.productos.some(p => p.categoria === categoria)
    );
  }

  filtrarProductos() {
    if (this.categoriaSeleccionada) {
      this.categoriasConProductos = [this.categoriaSeleccionada];
    } else {
      this.categoriasConProductos = this.categorias;
    }
  }

  getProductosPorCategoria(categoria: string): Producto[] {
    return this.productos.filter(p => p.categoria === categoria);
  }
}