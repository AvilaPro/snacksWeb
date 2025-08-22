import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<div>Cargando...</div>`
})
export class HomeComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getLatestReunion().subscribe({
      next: (reunion) => {
        if (reunion) {
          this.router.navigate(['/reunion', reunion.id]);
        } else {
          this.router.navigate(['/admin/reuniones']);
        }
      },
      error: () => {
        this.router.navigate(['/admin/reuniones']);
      }
    });
  }
}