import { Routes } from '@angular/router';
import { ReunionDetalleComponent } from './components/reunion-detalle.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home.component').then(m => m.HomeComponent) },
  { path: 'admin/productos', loadComponent: () => import('./components/admin-productos.component').then(m => m.AdminProductosComponent) },
  { path: 'admin/reuniones', loadComponent: () => import('./components/admin-reuniones.component').then(m => m.AdminReunionesComponent) },
  { path: 'reunion/:id', component: ReunionDetalleComponent },
  { path: '**', redirectTo: '/' }
];
