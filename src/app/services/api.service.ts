import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Reunion, Asignacion } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://snacksserver-production.up.railway.app';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  getReunion(id: number): Observable<Reunion> {
    return this.http.get<Reunion>(`${this.baseUrl}/reuniones/${id}`);
  }

  getLatestReunion(): Observable<Reunion> {
    return this.http.get<Reunion>(`${this.baseUrl}/reuniones/latest`);
  }

  getReuniones(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.baseUrl}/reuniones`);
  }

  createReunion(reunion: any): Observable<Reunion> {
    return this.http.post<Reunion>(`${this.baseUrl}/reuniones`, reunion);
  }

  updateReunion(id: number, reunion: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/reuniones/${id}`, reunion);
  }

  deleteReunion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reuniones/${id}`);
  }

  createProducto(producto: any): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, producto);
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/productos/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}`);
  }

  getProductosReunion(reunionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reuniones/${reunionId}/productos`);
  }

  asignarProducto(reunionId: number, productoId: number, nombreAmigo: string, cantidad: number, comentario?: string): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.baseUrl}/reuniones/${reunionId}/asignar`, {
      id_producto: productoId,
      nombre_amigo: nombreAmigo,
      cantidad,
      comentario
    });
  }
}
